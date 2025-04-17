# Speech to Text Converter with Word Export

![Speech to Text Converter](image.jpg)

This is a simple web application that converts speech to text using the Web Speech API and allows you to download the transcribed text as a Word document.

## Features

- Real-time speech-to-text conversion
- Download transcribed text as a Word document
- Simple and intuitive user interface
- Works in modern browsers (Chrome, Edge, Safari)

## How to Use

1. Start the application (see "Running the Application" below)
2. Click "Start Recording" to begin speech recognition
3. Speak clearly into your microphone
4. Click "Stop Recording" when you're done
5. Click "Download as Word" to save the transcribed text as a Word document
6. Use "Reset" to clear the current transcript and start over

## Browser Compatibility

This app uses the Web Speech API, which is currently best supported in Google Chrome, Microsoft Edge, and Safari. Firefox support is limited.

## Technical Details

- Uses the Web Speech API for speech recognition
- Employs docxtemplater and PizZip for Word document generation
- FileSaver.js for saving the generated document

## Running the Application

### Method 1: Using Node.js (Recommended)

1. Make sure you have Node.js installed
2. Clone or download this repository
3. Open a terminal in the project directory
4. Install dependencies (optional, only if you want to use `nodemon` for development):
   ```bash
   npm install
   ```
5. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000`

### Method 2: Direct File Access

Simply open the `index.html` file in your browser. However, some browsers may have security restrictions when opening files directly.

### Method 3: Using Python's HTTP Server

If you have Python installed, you can run a simple HTTP server:

```bash
# Using Python 3
python -m http.server

# Using Python 2
python -m SimpleHTTPServer
```

Then access the application at `http://localhost:8000`

## License

This project is open-source and free to use. 
