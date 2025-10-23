from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import json
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
socketio = SocketIO(app, cors_allowed_origins="*")

# Store connected users and their rooms
connected_users = {}
user_count = 0

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    global user_count
    user_count += 1
    print(f'User connected. Total users: {user_count}')

@socketio.on('disconnect')
def handle_disconnect():
    global user_count
    user_count -= 1
    username = connected_users.get(request.sid)
    if username:
        del connected_users[request.sid]
        emit('user_left', {'username': username, 'user_count': user_count}, broadcast=True)
    print(f'User disconnected. Total users: {user_count}')

@socketio.on('join')
def handle_join(data):
    username = data['username']
    connected_users[request.sid] = username
    join_room('general')
    
    # Notify all users about new user joining
    emit('user_joined', {
        'username': username, 
        'user_count': user_count,
        'message': f'{username} joined the chat'
    }, room='general', include_self=False)
    
    # Send current user count to the new user
    emit('user_count_update', {'user_count': user_count})

@socketio.on('send_message')
def handle_message(data):
    username = connected_users.get(request.sid, 'Anonymous')
    message_data = {
        'username': username,
        'message': data['message'],
        'timestamp': datetime.now().strftime('%H:%M:%S')
    }
    
    # Broadcast message to all users in the room
    emit('receive_message', message_data, room='general')

@socketio.on('typing')
def handle_typing(data):
    username = connected_users.get(request.sid, 'Anonymous')
    emit('user_typing', {
        'username': username,
        'is_typing': data['is_typing']
    }, room='general', include_self=False)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
