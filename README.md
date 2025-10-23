# Simple Chat Application

A real-time chat application built with Python Flask, Socket.IO, HTML, CSS, and JavaScript. Multiple users can join and chat in real-time over localhost or a network.

## Features

- Real-time messaging using WebSockets
- Modern and responsive UI design
- User join/leave notifications
- Typing indicators
- User count display
- Cross-platform compatibility
- Mobile-friendly interface

## Requirements

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

1. Start the server:

```bash
python app.py
```

2. Open your web browser and go to:

```
http://localhost:5000
```

3. Enter a username to join the chat
4. Start chatting with other users!

## Network Access

To allow other devices on your network to access the chat:

1. The server is already configured to accept connections from any IP address (`host='0.0.0.0'`)
2. Find your computer's IP address:
   - Windows: Run `ipconfig` in Command Prompt
   - Mac/Linux: Run `ifconfig` in Terminal
3. Other users can access the chat using: `http://YOUR_IP_ADDRESS:5000`

## File Structure

```
Simple Chat Application/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── style.css         # CSS styling
    └── script.js         # JavaScript functionality
```

## Technologies Used

- **Backend**: Python Flask with Flask-SocketIO
- **Frontend**: HTML5, CSS3, JavaScript
- **Real-time Communication**: Socket.IO
- **Styling**: Modern CSS with gradients and animations

## Features Explained

### Real-time Messaging
- Uses WebSocket connections via Socket.IO
- Messages are instantly delivered to all connected users
- No page refresh required

### User Management
- Tracks connected users
- Shows user join/leave notifications
- Displays current user count

### Typing Indicators
- Shows when other users are typing
- Automatically disappears after 1 second of inactivity

### Responsive Design
- Works on desktop and mobile devices
- Modern UI with smooth animations
- Clean and intuitive interface

## Customization

You can easily customize the application by modifying:

- `static/style.css` - Change colors, fonts, and layout
- `static/script.js` - Add new features or modify behavior
- `app.py` - Add new server-side functionality

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, modify the port in `app.py`:

```python
socketio.run(app, debug=True, host='0.0.0.0', port=5001)  # Change port number
```

### Firewall Issues
Make sure your firewall allows connections on the specified port.

### Network Access Issues
Ensure all devices are on the same network and can communicate with each other.

## License

This project is open source and available under the Bokacoders Licens.

