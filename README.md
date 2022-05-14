# Text editor using Quill.js, Node.js and mongoDB

This text editor project works like google docs, where a random room (random ID) is created, which can then be shared with other users, who can add, edit or delete text. All new inputs are sent to the server, which then shares it with every instance of the text editor that shares the same room ID.

The Quill.js editor is known to be vulnerable to XSS attacks. Data sanitisation is implemented (both on client and server), in order to prevent any malicious scripts reaching the server. This is especially important in this App, where the server immediatelly shares whatever is sent to it with other users.
