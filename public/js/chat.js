import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'


// Function
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", 'shown');

    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    },2000);
}

// Show Typing

// End Show Typing

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData){
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;

        if (content){
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}
// CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const div = document.createElement("div");
    const BoxTyping = document.querySelector(".chat .inner-list-typing");

    let htmlFullName = "";
    if (myId == data.userId){
        div.classList.add("inner-outgoing");
    } else {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `
    body.insertBefore(div, BoxTyping);
    body.scrollTop = body.scrollHeight
});
// SERVER_RETURN_MESSAGE

// SCROLL CHAT TO BOTTOM
const body = document.querySelector(".chat .inner-body");
if (body){
    body.scrollTop = body.scrollHeight
}
// SCROLL CHAT TO BOTTOM

// START EMOJI
// Show popup
const button = document.querySelector('.button-icon')
if (button){
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(button, tooltip)

    button.onclick = (event) => {
        tooltip.classList.toggle('shown')
        event.stopPropagation(); // Ngăn sự kiện lan lên document
    }

    // Khi bấm ngoài emoji tự tắt tab
    document.addEventListener('click', (event) => {
        if (!tooltip.contains(event.target) && !button.contains(event.target)) {
            tooltip.classList.remove('shown');
        }
    });
}

// Insert Icon to Input
var timeOut;
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker){
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");

    emojiPicker.addEventListener('emoji-click', (event) => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
        // Luon cho tro chuot ở cuối tn khi quá dài
        const end = inputChat.value.length;
        inputChat.setSelectionRange(end,end);
        inputChat.focus();

        showTyping();
    });

    inputChat.addEventListener('keyup', () => {
        showTyping();
    });
}
// END EMOJI


// SEVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping){
    socket.on("SEVER_RETURN_TYPING", (data) => {
        if (data.type == "shown"){
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            const body = document.querySelector(".chat .inner-body");

            if (!existTyping){
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);
    
                boxTyping.innerHTML = `
                    <div class="box-typing">
                        <div class="inner-name">${data.fullName}</div>
                        <div class="inner-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                `
                elementListTyping.appendChild(boxTyping);
                body.scrollTop = body.scrollHeight
            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove){
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
        
    });
}

// End SEVER_RETURN_TYPING