# Text editor using Quill.js, Node.js and mongoDB

This text editor project emulates google docs; a random room (random ID) is created, which can then be shared with other users, who can add, edit or delete text. All new inputs are sent to the server, which then broadcasts them to every instance of the text editor that shares the same room ID.

The Quill.js text editor is used for this app, which is known to be vulnerable to XSS attacks. Data sanitisation is implemented (both on client and server), in order to prevent any malicious scripts reaching the server. This is especially important in this app, where the server immediatelly shares whatever is sent to it with other users.
