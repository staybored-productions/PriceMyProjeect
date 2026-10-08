# Form backend integration (not yet configured)

The homepage, estimate results, and Feedback page forms are intentionally front-end only. They validate input and announce that nothing has been sent; they do not store personal information.

To activate: configure an HTTPS server endpoint (PHP on Namecheap or a secured Google Apps Script/Sheets integration). In script.js, replace the final not-active status in each submit handler with a fetch POST to that endpoint, using JSON and Content-Type: application/json. The server must validate email and feedback again, require opt-in for mailing list enrollment, protect against spam, and return explicit success/failure responses. Only show a success message after a confirmed server response. Store opt-in consent with timestamp and consent wording, and provide unsubscribe capability before sending marketing emails. Do not publish a Google Sheets credential or API key in client-side code.
