$(document).ready(function() {

    // fade in page
    $(".container").fadeIn(1500);

    // define variables that refer to the buttons, colors on the buttons, and audio when buttons are pressed
    var button = [$('.quarter0'), $('.quarter1'), $('.quarter2'), $('.quarter3')];
    var colors = ['#8ce2ec', '#ff9999', '#ffda90', '#83e5c7', '#ffffff'];
    var baseUrl = "https://s3.amazonaws.com/freecodecamp/";
    var audio = ['simonSound4.mp3', 'simonSound3.mp3', 'simonSound2.mp3', 'simonSound1.mp3'];

    // array to hold computer's chosen order of buttons
    var computerArray = [];
    // array to hold user's chosen order of buttons
    var userArray = [];
    // integer that is either 0, 1, 2, 3 randomly chosen
    var randomInteger = Math.floor(Math.random() * 4);
    // counter that stores level user is at during game starting at 1
    var patternCount = 1;
    // variable that stores the display of the next button to be displayed
    var nextButton;
    // determine whether it is user's turn to act
    var userTurn = false;
    // determine whether game has started
    var on = false;
    // determine whether strict mode is on or not
    var strictMode = false;
    // stores winner celebration
    var winCelebration;
    // variables to hold index of button being displayed and length of computer Array
    var index, length;

    // display a random pattern of buttons
    function displayPattern() {
        // no longer user's turn
        userTurn = false;
        // take random integer from 0 to 3
        var j = computerArray[index];
        // display chosen button
        window.setTimeout(function() {
            button[j].css('background-color', colors[4]);
        }, 500)
        // turn off chosen button
        window.setTimeout(function() {
            button[j].css('background-color', colors[j]);
        }, 1000)
        // increase index
        index++;
        // if sequence of patterns hasn't finished, load the next button in the sequence
        if (index < length) {
            nextButton = window.setTimeout(displayPattern, 1000);
            // else allow user to enter pattern
        } else {
            window.setTimeout(function() {
                userTurn = true;
            }, 1000);
        }
    }

    // check to see if user sequence matches the computer's sequence of buttons
    function check() {
        // variable to hold the number of correct sequence matches
        var correctCount = 0;
        // check to see how many matches there are
        for (var a = computerArray.length - 1; a >= 0; a--) {
            // if sequence doesn't match, stop checking
            if (computerArray[a] !== userArray[a]) {
                break;
            }
            correctCount++;
        }
        // if user sequence is the same as computer's seqence
        if (correctCount === length) {
            // increase the level
            patternCount++;
            // if pattern count is beyond 20, user wins
            if (patternCount > 20) {
                // congratulate user
                $('#count').text('Bravo!');
                // play winning celebration
                var musicIndex = 0;
                winCelebration = setInterval(function() {
                    new Audio(baseUrl + audio[musicIndex % 4]).play();
                    button[musicIndex % 4].css('background-color', colors[4]);
                    button[(musicIndex + 2) % 4].css('background-color', colors[4]);
                    window.setTimeout(function() {
                        button[musicIndex % 4].css('background-color', colors[musicIndex % 4]);
                        button[(musicIndex + 2) % 4].css('background-color', colors[(musicIndex + 2) % 4]);
                        musicIndex++;
                    }, 250)
                }, 500);
                // reset all variables and begin game again in 10 seconds
                window.setTimeout(function() {
                    clearTimeout(winCelebration);
                    $('#count').text('Starting...');
                    window.setTimeout(function() {
                        reset();
                        displayPattern();
                    }, 3000);
                }, 10000);
                // if pattern count is 20 or below, continue displaying new pattern
            } else {
                // reset relevant variables and add to computer's sequence of buttons
                userArray = [];
                randomInteger = Math.floor(Math.random() * 4);
                computerArray.push(randomInteger);
                index = 0;
                length = computerArray.length;
                $('#count').text(patternCount);
                displayPattern();
            }
            // else if user's sequence is different from computer's sequence
        } else {
            // if stict mode is on
            if (strictMode === true) {
                // inform user of incorrect sequence
                $('#count').text('Wrong!');
                // reset game to the beginning
                window.setTimeout(function() {
                    reset();
                    displayPattern();
                }, 2500);
                // if strict mode is off
            } else {
                // inform user of incorrect sequence
                $('#count').text('Wrong!');
                // redisplay pattern
                userArray = [];
                index = 0;
                window.setTimeout(function() {
                    $('#count').text(patternCount);
                    displayPattern();
                }, 2000)
            }
        }
    }

    // reset all variables and start game over
    function reset() {
        patternCount = 1;
        userArray = [];
        computerArray = [];
        randomInteger = Math.floor(Math.random() * 4);
        computerArray.push(randomInteger);
        index = 0;
        length = computerArray.length;
        $('#count').text(patternCount);
    }

    // when start button is clicked
    $('#onOff').click(function() {
        // if game not
        if (on === false) {
            // start game, ready variables, display first pattern
            on = true;
            $('#count').text('Ready');
            $('#onOff').css('color', 'white');
            // if the game has started, turn off game
        } else {
            on = false;
            clearTimeout(nextButton);
            clearTimeout(winCelebration);
            $('#count').text('');
            $('#onOff').css('color', 'black');
        }
    })

    // when start button is clicked
    $('#start').click(function() {
        if (on === true) {
            // stop computer from displaying the button sequence
            clearTimeout(nextButton);
            clearTimeout(winCelebration);
            // turn off user button presses
            userTurn = false;
            // inform user of start
            $('#count').text('Starting...');
            // highlight start button
            $('#start').css('color', 'white');
            // reset game in 3 seconds
            window.setTimeout(function() {
                $('#start').css('color', 'black');
                reset();
                displayPattern();
            }, 3000);
        }
    })

    // when strict button is clicked
    $('#strict').click(function() {
        // if game is on
        if (on === true) {
            // if strict mode was on, turn off
            if (strictMode === true) {
                strictMode = false;
                $('#strict').css('color', 'black');
                // if strict mode was off, turn on
            } else {
                strictMode = true;
                $('#strict').css('color', 'white');
            }
        }
    })

    // if button is clicked
    button[0].click(function() {
        // if the computer isn't doing something
        if (on === true && userTurn === true) {
            // make sound
            new Audio(baseUrl + audio[0]).play();
            // memorize user's button click in sequence
            userArray.push(0);
            // when number of user's clicks is equal to number of buttons displayed, check to see if user's click sequence is correct
            if (userArray.length === computerArray.length) {
                userTurn = false;
                check();
            }
        }
    })
    // if button is clicked
    button[1].click(function() {
        // if the computer isn't doing something
        if (on === true && userTurn === true) {
            // make sound
            new Audio(baseUrl + audio[1]).play();
            // memorize user's button click in sequence
            userArray.push(1);
            // when number of user's clicks is equal to number of buttons displayed, check to see if user's click sequence is correct
            if (userArray.length === computerArray.length) {
                userTurn = false;
                check();
            }
        }
    })
    // if button is clicked
    button[2].click(function() {
        // if the computer isn't doing something
        if (on === true && userTurn === true) {
            // make sound
            new Audio(baseUrl + audio[2]).play();
            // memorize user's button click in sequence
            userArray.push(2);
            // when number of user's clicks is equal to number of buttons displayed, check to see if user's click sequence is correct
            if (userArray.length === computerArray.length) {
                userTurn = false;
                check();
            }
        }
    })
    // if button is clicked
    button[3].click(function() {
        // if the computer isn't doing something
        if (on === true && userTurn === true) {
            // make sound
            new Audio(baseUrl + audio[3]).play();
            // memorize user's button click in sequence
            userArray.push(3);
            // when number of user's clicks is equal to number of buttons displayed, check to see if user's click sequence is correct
            if (userArray.length === computerArray.length) {
                userTurn = false;
                check();
            }
        }
    })
});
