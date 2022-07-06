import { URL } from 'url';

// const __dirname = new URL('.', import.meta.url).pathname;
//console.log('meta:', import.meta);
// console.log(__dirname);

class A {
    constructor() {
        this.path = new URL('.', import.meta.url).pathname;
        console.log(this.path);
    }
}

new A();
