# WordScramble

Goal:
The goal here is to create a word scramble game that gives the user random 6 letter words where the letters are shuffled and the user has to guess the word.
The app is written completely in javascript usign AngularJs framework and css styling

Scoring:
The app uses a simple scoring system where the user gets 3 pts for guessing right within the first 5 seconds, 2 pts for guessing right within 15 secs and 1 pt for guessing right after that. The user gets 30 seconds to guess for each word.

Suggested Improvements:
 - Words don't need to be limited to fixed size, we can have words of varying lengths to make it more challenging, we would just need to tweak the input parameters for the Wordnik API and change the css to fit the dynamic lengths of the words
 - My initial idea was to make the shuffled letters look like the letters on a Scrabble shelf, and the output location to be like a Scrabble board line, but the css would be a little hard to get the styling right - might be able to use an image instead to make it look more authentic
 - Also, making css animations would make it look a little nicer when we're typing the words
 - Being able to store the user's past scores (atleast the top 3-5 scores) would be a good addition. We would have to create some sort of log-in for the user and have a server-side db to store the scores, or if we want to keep it light and simple, we can just use localStorage to do this but the user would lose this data if the browser cache is cleared
 - Another interesting and easy thing to add would be to show the user the dictionary definition once the word is shown to help them easily guess the word based on the meaning
 - Button to re-shuffle the letters, sometimes a rearrangement of letters helps with the answer
 - Show the correct answer if the time ends - before showing the game over card
