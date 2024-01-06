import ChatAPI from "./api/ChatAPI";

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
    this.userName = '';
  }

  init() {
   const regForm = document.querySelector('.modal__form');
   regForm.classList.add('active');
   regForm.classList.remove('hidden');
   const errMsg = document.querySelector('.modal__header');
  errMsg.textContent = "Choose nickname!";
   console.log('Chat init!');

   const modalOk = document.querySelector('.modal__ok');

   modalOk.addEventListener('click', (e) => {
      e.preventDefault();
      const errMsg = document.querySelector('.modal__header');
      const nameInput = document.querySelector('.modal__form .form__input');
      if (!nameInput.value) return;

          errMsg.textContent = "";
      

      const options = {
        data: {
          name: nameInput.value,
        },
       };
                                  // CALLBACK
       this.api.register(options, (data) => {
        console.log('data stat: ', data.status)
        if (data.status === 'error') {
          const errMsg = document.querySelector('.modal__header');
          errMsg.textContent = "This name already exists! Try another one!";
          return;
        }
         this.userName = data.user.name;
         console.log('Curr user name is: ', this.userName);
         const regForm = document.querySelector('.modal__form');
         regForm.classList.add('hidden');
         regForm.classList.remove('active');

         const chatContainer = document.querySelector('.container');
         chatContainer.classList.remove('hidden');
         this.onEnterChatHandler();
         this.registerEvents();
         this.subscribeOnEvents();
       });
    });
      
  }

  bindToDOM() {}

  registerEvents() {
    const userList = document.querySelector('.chat__userlist');
    const messages = document.querySelector('.chat__messages-container');


    this.websocket.addEventListener('message', (e)=> {
      console.log('received msg from server: ', e.data);
  
      const data = JSON.parse(e.data);

      if (data.type === 'send') {
       
          const message = document.createElement('div');
          data.name === this.userName ? message.classList.add('message__container-yourself') : message.classList.add('message__container');
          const msgHeader = document.createElement('div');
          msgHeader.classList.add('message__header');
          msgHeader.textContent = data.name+': ';
          const inter = document.createElement('div');
          inter.classList.add('message__container-interlocutor');
          
          message.appendChild(msgHeader);
          message.appendChild(document.createTextNode(data.text));
          messages.appendChild(message);
          messages.appendChild(inter);
  
      } else {
        userList.innerHTML = '';
        data.forEach(userInfo => {
          const user = document.createElement('div');
          user.classList.add('chat__user');
          userInfo.name === this.userName ? user.textContent = 'You' : user.textContent = userInfo.name;
          userList.appendChild(user);
      });
      }     
  
      console.log('ws message');
  });
  
  }

  subscribeOnEvents() {
    const sendBtn = document.querySelector('.send__btn');
    const chatMessage = document.querySelector('.form__input');
   
    sendBtn.addEventListener('click', (event) => {

      event.preventDefault();

      if (!chatMessage.value) return;
    
      const message = {
        type: 'send',
        text: chatMessage.value,
        name: this.userName,
      };

      this.websocket.send(JSON.stringify(message));  
      chatMessage.value = '';
    });

    const exitBtn = document.querySelector('.exit__btn');
   
    exitBtn.addEventListener('click', (event) => {
      console.log('EXIT clicked!');
      event.preventDefault();
    
      const message = {
        type: 'exit',
        user: {
          name: this.userName,
        },
      };     
  
      this.websocket.send(JSON.stringify(message));
      const chatContainer = document.querySelector('.container');
      chatContainer.classList.add('hidden');
      this.init();
    });
  }

  onEnterChatHandler() {
    this.websocket = new WebSocket('ws://websocket-chat-3iqe.onrender.com/ws');
    this.websocket.addEventListener('open', (e)=> {
      console.log(e);
  
      console.log('ws open');
  });
  }

  sendMessage() {}

  renderMessage() {}


}