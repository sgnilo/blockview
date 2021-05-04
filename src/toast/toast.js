class Toast {
    constructor() {
        this.setNode();
    }

    setNode() {
        this.dom = document.querySelector('#toast');
        this.successIcon = document.querySelector('.success-icon');
        this.failIcon = document.querySelector('.fail-icon');
        this.contentNode = document.querySelector('.toast-content');
    }

    show(text) {
        this.dom.style.visibility = 'visible';
        this.dom.style.top = '50px';
        this.dom.style.opacity = 1;
        this.contentNode.innerText = text;
    }

    close() {
        this.dom.style.visibility = 'hidden';
        this.dom.style.top = '0';
        this.dom.style.opacity = 0;
        // this.contentNode.innerText = '';
    }

    success({content, duration = 2000}) {
        if (!this.dom || !this.successIcon || !this.failIcon || !this.contentNode) {
            this.setNode();
        }
        this.successIcon.style.display = 'block';
        this.failIcon.style.display = 'none';
        this.show(content);
        setTimeout(() => {
            this.close();
        }, duration);
    }

    fail({content, duration = 2000}) {
        if (!this.dom || !this.successIcon || !this.failIcon || !this.contentNode) {
            this.setNode();
        }
        this.failIcon.style.display = 'block';
        this.successIcon.style.display = 'none';
        this.show(content);
        setTimeout(() => {
            this.close();
        }, duration);
    }

    
};

export default new Toast();