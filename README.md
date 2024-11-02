# SoundSynk

SoundSynk is a real-time audio sync application that allows multiple devices on the same local network to share and play audio in sync without the need for a server. Using WebRTC and WebSockets, SoundSynk creates a seamless audio experience for group sessions over WiFi or a mobile hotspot.

## Features

- **Select Mode**: Choose between hosting a session or joining as a peer.
- **Host Mode**: Acts as the central audio source, enabling other devices to connect and sync with its audio stream.
- **Peer Mode**: Allows devices to join an existing session and listen to the host's audio in real-time.
- **Local Network Sync**: Operates over a local network, eliminating the need for internet connectivity.
- **Low Latency Audio**: Utilizes WebRTC for minimal lag, providing smooth, synchronized playback across connected devices.

## Tech Stack

- **Frontend**: React for user interface, Tailwind CSS for styling
- **Networking**: WebRTC for real-time communication, WebSockets for session management and device connections
- **Audio Processing**: HTML5 Audio API

## How to Use

1. **Host a Session**: Choose "Host Mode" to start a session and share your audio.
2. **Join a Session**: Choose "Peer Mode" to connect to a host on the same network and enjoy synchronized audio playback.

## Use Cases

- Group listening experiences for friends or family gatherings.
- Sync audio playback across multiple devices in close proximity.
- Perfect for shared audio experiences 


## Contributions

Contributions are welcome! Feel free to open issues or submit pull requests to improve SoundSynk.
