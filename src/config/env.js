const requiredVariables = [

"MONGO_URI",

"JWT_SECRET",

"CLIENT_URL"
];

requiredVariables.forEach(variable=>{

if(!process.env[variable]){

throw new Error(`${variable} Missing`);

}

});