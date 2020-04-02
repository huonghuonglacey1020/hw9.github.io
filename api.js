const axios = require ('axios');
const inquirer = require('inquirer')
const pdf = require("html-pdf");
const fs = require('fs');
const util = require("util")
const generateHTML = require("./generateHTML");
const writeFileAsync = util.promisify(fs.writeFile); 



const question = [
    
    {
        type: "input",
        name: "username",
        message: "Enter your GitHub Username",
    },
    {
        type: "list",
        choices:["pink", "red", "blue", "green"],
        message: "what color do you like?",
        name: "color",
    },
];
require('dotenv').config();


function getUser() {
        return new Promise(function(resolve, reject){
            inquirer.prompt(question).then(async function(answers){
                const {username, color} = answers;
                const url = `https://api.github.com/users/${username}`;
                try {
                    const response = await axios.get(url);
                    const stars = await getStars(username);
                    resolve({
                        ...response.data,
                        color,
                        stars,

                    });

                } catch (error){
                    reject(error)
                };
                
            });
        });
    };

function getStars(username) {
        const url1 = `https://api.github.com/users/${username}/starred`;
        return axios.get(url1).then(function(res) {
            const repo = res.data.length;
            return repo;
        });
}
        
        
        
        
init();
        
async function init(repo) {
    try{
        const data = await getUser();
        const html = generateHTML(data);
        await writeFileAsync("./profile.html", html)
        pdf.create(html).toFile("./profile.pdf", function(err, res){
            console.log(res.profile)
                

        });
    } catch (error) {
        console.log(error)
    }
};
getStars();












