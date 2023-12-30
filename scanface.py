from flask import Flask, render_template, Response, jsonify
import cv2
import face_recognition

app = Flask(__name__)

remzi_image = face_recognition.load_image_file("static/remzi.jpg")
remzi_face_encoding = face_recognition.face_encodings(remzi_image)[0]

known_face_encodings = [remzi_face_encoding]
known_face_names = ["Remzi Tural"]

video_capture = cv2.VideoCapture(0)

face_recognized = False

@app.route('/')
def index():
    return render_template('scanface2.html')

def generate_frames():
    global face_recognized
    
    while True:
        success, frame = video_capture.read()
        if not success:
            break
        else:
            face_recognized = False

            face_locations = face_recognition.face_locations(frame)
            face_encodings = face_recognition.face_encodings(frame, face_locations)

            for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)

                name = "Bilinmeyen"
                
                if True in matches:
                    first_match_index = matches.index(True)
                    name = known_face_names[first_match_index]
                    if name == "Remzi Tural":
                        face_recognized = True
                    
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 0.5, (255, 255, 255), 1)

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/get_name')
def get_name():
    global face_recognized 
    return jsonify(1 if face_recognized else 0)

if __name__ == '__main__':
    app.run(debug=True)
