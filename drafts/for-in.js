const proto = {
    name: 'Viktor',
    city: 'Moscow',
};

const obj = Object.create(proto);
obj.name = 'Vlad';
obj.age = 25;

for (const v in obj) {
    console.log(obj[v]);
}

const arr = ['Moscow', 'Perm'];
for (const v in arr) {
    console.log(v);
}
