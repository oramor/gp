class Parent {
    constructor() {
        this.a = 'a';
        this.call();
        //console.log(this);
    }

    call() {
        console.log(this);
    }
}

class Child extends Parent {
    constructor() {
        super();
        this.b = 'b';
        this.call();
        //console.log(this);
    }
}

//new Parent();
new Child();
