// DOMContentLoaded Event : DOM이 구성되면 발생하는 Event (화면로딩)
document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.querySelector('#chat-box'); // 대화 목록 BOX
    const chatForm = document.querySelector('#chat-form');// 입력 메세지 Form
    const messageInput = document.querySelector('#message-input'); // 메세지 입력 양식
    const sendButton = document.querySelector('#send-button'); // 전송버튼

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const message = messageInput.value.trim(); // 입력 메세지를 읽기.
        if (!message) return;

        appendMessage(message, 'user-message'); //  chat box에 메세지를 출력
        messageInput.value = '';
        toggleForm(true);

        let aiMessageElement = null; // LLM 응답 메세지를 저장할 변수
        
        // SSE 요청 -> EventSource(요청 url)
        // encodeURIComponent(str): URL 인코딩 처리.

        const eventSource = new EventSource(`/chat/stream/?message=${encodeURIComponent(message)}`);

        // EventSource에 Event Hander를 추가.
        // onmessage: 서버에서 답변이 올때마다 호출. 서버에서 전송된 메세지: event.data 
        // onerror: 실행도중 Error가 발생하면 호출
        eventSource.onmessage = (event) => {
            if (event.data === '[DONE]') { // data: 메세지\n\n . 메세지만 반환
                eventSource.close(); // 연결 끊기
                toggleForm(false);
                return;
            }

            if (!aiMessageElement) {
                aiMessageElement = appendMessage('', 'ai-message');//<div ..></div>
            }

            if (event.data.startsWith('[ERROR]')) {
                aiMessageElement.innerHTML += `<span style="color: red;">${event.data}</span>`;
                eventSource.close();
                toggleForm(false);
            } else {
                aiMessageElement.innerHTML += event.data;
            }
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        eventSource.onerror = (err) => {
            console.error('EventSource 실패:', err);
            if (aiMessageElement) {
                aiMessageElement.innerHTML += `<span style="color: red;">[Error] 연결 실패</span>`;
            } else {
                appendMessage('<span style="color: red;">[Error] 연결 실패</span>', 'ai-message');
            }
            eventSource.close();
            toggleForm(false);
        };
    });

    function appendMessage(content, className) {
        const messageElement = document.createElement('div');
        messageElement.setAttribute("class", `message ${className}`);
        messageElement.innerHTML = content;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageElement; //<div class='message xxx-message'>content</div>
    }

    function toggleForm(disabled) {
        messageInput.disabled = disabled;
        sendButton.disabled = disabled;
        if (!disabled) {
            messageInput.focus();
        }
    }
});
