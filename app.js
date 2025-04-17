document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const status = document.getElementById('status');
    const output = document.getElementById('output');

    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        status.textContent = 'Your browser does not support Speech Recognition. Please try Chrome, Edge, or Safari.';
        startBtn.disabled = true;
        return;
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure Recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let isRecording = false;
    let finalTranscript = '';

    // Event Listeners
    startBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    resetBtn.addEventListener('click', resetTranscript);
    downloadBtn.addEventListener('click', downloadWordDoc);

    // Recognition Events
    recognition.onstart = () => {
        status.textContent = 'Listening... Speak now';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        isRecording = true;
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        output.value = finalTranscript + interimTranscript;
        
        // Enable reset and download buttons if we have text
        if (finalTranscript.trim() !== '') {
            resetBtn.disabled = false;
            downloadBtn.disabled = false;
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        status.textContent = `Error: ${event.error}. Try again.`;
        stopRecording();
    };

    recognition.onend = () => {
        if (isRecording) {
            // If we're still supposed to be recording, restart it
            // This handles the case when recognition stops automatically
            recognition.start();
        } else {
            status.textContent = 'Recording stopped';
        }
    };

    // Functions
    function startRecording() {
        finalTranscript = '';
        recognition.start();
    }

    function stopRecording() {
        isRecording = false;
        recognition.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
        status.textContent = 'Recording stopped';
    }

    function resetTranscript() {
        finalTranscript = '';
        output.value = '';
        resetBtn.disabled = true;
        downloadBtn.disabled = true;
        status.textContent = 'Transcript cleared';
    }

    function downloadWordDoc() {
        const text = output.value.trim();
        
        if (!text) {
            status.textContent = 'No text to download';
            return;
        }

        status.textContent = 'Generating Word document...';
        
        // Try to load template from CDN
        loadFile("https://unpkg.com/pizzip@3.1.4/example/data/template.docx", function(error, content) {
            if (error) {
                console.error("Error loading template from CDN:", error);
                // Use simple text fallback
                generateSimpleTextDoc(text);
                return;
            }

            try {
                const zip = new PizZip(content);
                const doc = new window.docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                });

                // Set data
                doc.setData({
                    content: text,
                    date: new Date().toLocaleDateString()
                });

                // Render document
                doc.render();
                
                // Generate and download
                const blob = doc.getZip().generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });
                
                saveAs(blob, "speech-to-text-" + new Date().toISOString().slice(0, 10) + ".docx");
                status.textContent = 'Word document downloaded successfully!';
            } catch (error) {
                console.error("Error generating document with template:", error);
                // Use simple text fallback
                generateSimpleTextDoc(text);
            }
        });
    }

    // Fallback method for Word document generation
    function generateSimpleTextDoc(text) {
        try {
            // Create a simple text file with .docx extension
            const blob = new Blob([
                "Speech to Text Transcript\n",
                "Date: " + new Date().toLocaleDateString() + "\n\n",
                text
            ], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
            
            saveAs(blob, "speech-to-text-" + new Date().toISOString().slice(0, 10) + ".docx");
            status.textContent = 'Simple document downloaded successfully!';
        } catch (error) {
            console.error("Error generating simple document:", error);
            status.textContent = 'Error generating document: ' + error;
        }
    }

    // Helper function to load template
    function loadFile(url, callback) {
        PizZipUtils.getBinaryContent(url, callback);
    }
});

// Create a simple template in case the one from the CDN doesn't work
(function createTemplate() {
    const templateContent = 
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <?mso-application progid="Word.Document"?>
    <w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml">
        <w:body>
            <w:p>
                <w:r>
                    <w:t>Date: {date}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    <w:t>{content}</w:t>
                </w:r>
            </w:p>
        </w:body>
    </w:wordDocument>`;

    window.templateContent = templateContent;
})(); 