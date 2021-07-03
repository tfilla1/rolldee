const Discord = require('discord.js'); 
require('dotenv').config();
const client = new Discord.Client();  

/*
    d20
    d10
    d8
    d4
*/

function reset() 
{
    console.log(`Logged in as ${client.user.tag}!`); 
}

client.on('ready', () => {   
    console.log('hi');
    reset();
});
client.on('message', receiveMessage);

function showUsers() {
    var returnString = '';
    warUsers.forEach(wu => {
        returnString += wu.id + '; ';
    });
    return returnString;
}
function roll(die) {
    //get math.rand
    //between 1 and n
    if (die == 100) {
        var answer = Math.floor(Math.random() * 100);
        while (answer % 10 != 0) {
            answer = Math.floor(Math.random() * 100);
        }
        return answer;
    } else {
        return Math.floor(Math.random() * parseInt(die));
    }
}
function vantage(die, type) {
    //roll with advantage or disadvantage
    //roll two dice and return higher
    //roll two dice and return lower
    var first = roll(die);
    var second = roll(die);
    var answer = {
        rolls: [first, second],
        final: 0
    };
    console.log(answer);
    if (type === 'dad') {
        if (first < second) {
            answer.final = first;
        } else {
            answer.final = second;
        }
    } else {
        if (first > second) {
            answer.final = first;
        } else {
            answer.final = second;
        }
    }
    return answer;
}

// /roll d m 8 d 6
// amount is 8
// die is a d6
function multi(amt, die) {
    var answer = {
        rolls: [],
        final: 0
    };
    for (var i = 0; i < amt; i++) {
        temp = roll(die);
        answer.rolls.push(temp);
        answer.final += temp;
        console.log('final: ' + answer.final);
    }
    return answer;
}

function toString(answer) {
    
    var rollString = '';
    for (var i = 0; i < answer.rolls.length; i++) {
        rollString += answer.rolls[i];
        if (i != answer.rolls.length) {
            rollString += ',';
        }
    }
    var returnString = 'Rolls: ' + rollString
                     + ' Final Count: ' + answer.final;
     return returnString;
}

function receiveMessage(msg) {
    if(msg.author.bot) return;
    
    //if msg length >= 5
    // /roll d 5
    // /roll d 20 d adv
    // /roll d 20 d dad
    //2
    //3
    
    // /roll d 2 multi d 20
    // /roll d 2 m d 20
    
    //rolld m 8 d 6
    
    //dnd is split on d
    
    if (msg.content.length >= 6) {
        var something = msg.content.split('d');
        if (something.length == 2) {
            if (parseInt(something[1])) {
                // /roll d 5
                msg.reply(roll(something[1]));
            } 
        } else if (something.length == 3) {
            // /roll d m8 d 6
            var answer = multi(something[1].split('m')[1], something[2]);
            
            msg.reply(toString(answer));
            
        } 
        else if (something.startsWith('/rolld'))  {
            // /roll d 20 d ad
            // /roll d 20 d adv
            var len = something.length - 2;
            var answer = {
                rolls: [],
                final: 0
            };
            //msg.reply(something[len].substring(0, 1));
            if (something[len].substring(0, 1) == 'a') {
                console.log('adv');
                answer = vantage(something[1], 'adv');
            } else {
                console.log('dad');
                answer = vantage(something[1], 'dad');
            }
            msg.reply(toString(answer));
        }
    }
}
client.login(process.env.BOT_TOKEN);
