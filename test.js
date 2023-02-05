const arr = [];

arrobj = [
    {name: 'a', value: 1},
    {name: 'b', value: 2},
    {name: 'c', value: 3},
]

arr.push(...arrobj);


arrObj1 = [
    {name: 'd', value: 4},
    {name: 'e', value: 5},
    {name: 'f', value: 6},
]

arr.push(...arrObj1);
console.log(arr);