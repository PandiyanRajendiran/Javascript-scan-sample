// Notes Table: 
// A3 = 220.00 
// A#3 = 233.08
// B3  = 246.94	
// C4  = 261.63 (middle C) 
// C#4 = 277.18
// D4  = 293.66
// D#4 = 311.13
// E4  = 329.63	
// F4  = 349.23
// F#4 = 369.99	
// G4  = 392.00
// G#4 = 415.30
// A4  = 440.00			
// A#4 = 466.16	

// Semitones Table 
// 0 = Unison
// 1 = Semitone
// 2 = Tone
// 3 = MinorThird
// 4 = MajorThird
// 5 = PerfectFourth
// 6 =  Tritone
// 7 = PerfectFifth
// 8 = MinorSixth
// 9 = MajorSixth
// 10 = MinorSeventh
// 11 = MajorSeventh
// 12 = PerfectOctave

var RelativePitch = (function() 
{
  // HTML Element IDs
  // To print Results
  var resultCanvas; 
  var difficultyCanvas; 
  // Private Variables for both Perfect Pitch and Relative Pitch Games 
  var myAudioContext; // audio context used 
  var oscillator;
  var gainNode;
  // Changing notes each time  (for Perfect Pitch) 
  var NoteFrequency; // Available notes to play 
  var semitones; 	// number of semitones above current note  (refer to Semitones Table for answer) 
  var semitoneRatio; // to calculate how much to multiply for next semitone  
  var noteToPlay;  // current note played by player (not in frequency) 
  var lengthOfNote; // duration of note to be played
  var relationGuessed; // current note guessed by player (in frequency) 

  // To limit the number of notes that can be played 
  var difficulty; // 4=> 4 semitones, 8 => 8 semitones, 13 => all the way up to 12 semitones => octave 
    // Anything lower or higher and speakers can't really play it
	// 220 = A3 is the lowest it can go with difficulty 1
  
  var notePlaying;
				   // 1 => notes are being played
				   // 0 => no notes are being played 
  
    // Constructor
  var RelativePitch = function() 
  {
				// A3 -> G#4 
    NoteFrequency = [220.00, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00];
	resultCanvas = document.getElementById('Result');
	difficultyCanvas = document.getElementById('Difficulty'); 
	difficulty = 4; // Difficulty must be an integer more than or equal to 0
    noteToPlay = Math.floor(Math.random() * 13); // Generate random number between 0 - 12 to play a random note 
    myAudioContext = new webkitAudioContext() // Note: There is a limit to how many webkitAudioContext() you can make, exceed this and no sound is played. 
	semitones = 0; // initialize with 0 semitones => unison 
	semitones = Math.floor(Math.random() * difficulty); // generate random number between 0 - (difficulty -1) 
	semitoneRatio = Math.pow(2, (semitones/12)); 
	lengthOfNote = 1; // play notes for 1 second 
	
	oscillator = myAudioContext.createOscillator(); 
	oscillator.connect(myAudioContext.destination); 
	oscillator.type = 0; // use sine wave 
		// 0 = Sine wave 
		// 1 = Square wave 
		// 2 = Sawtooth wave 
		// 3 = Triangle wave 
	oscillator.frequency.value = NoteFrequency[noteToPlay]; // in hertz
	oscillator.start(myAudioContext.currentTime); 
	oscillator.stop(myAudioContext.currentTime+lengthOfNote); 
   // Create an audio context for next note to be played 
	oscillator = myAudioContext.createOscillator(); 
	oscillator.connect(myAudioContext.destination); 
	oscillator.type = 0; // use sine wave 
		// 0 = Sine wave 
		// 1 = Square wave 
		// 2 = Sawtooth wave 
		// 3 = Triangle wave 
	oscillator.frequency.value = NoteFrequency[noteToPlay] * semitoneRatio; // in hertz
	oscillator.start(myAudioContext.currentTime+(2*lengthOfNote)); 
	oscillator.stop(myAudioContext.currentTime+(2*lengthOfNote)+lengthOfNote); 
	notePlaying = 1; 
   // Create an audio context for next note to be played 
	oscillator = myAudioContext.createOscillator(); 
	oscillator.connect(myAudioContext.destination); 
	oscillator.type = 0; // use sine wave 
		// 0 = Sine wave 
		// 1 = Square wave 
		// 2 = Sawtooth wave 
		// 3 = Triangle wave 
	oscillator.frequency.value = NoteFrequency[noteToPlay]; // in hertz
	
  };
  
  RelativePitch.generateNewNote = function()
  {
		noteToPlay = Math.floor(Math.random() * 13); // Generate random number between 0 - 12 to play a random note 
		semitones = Math.floor(Math.random() * difficulty); // generate random number between 0 - (difficulty -1) 
		semitoneRatio = Math.pow(2, (semitones/12)); 
		
		resultCanvas.innerHTML="New Notes Generated, Play Again";
		RelativePitch.stopSound(); 
  }

  
  RelativePitch.playSound = function()
  {

	oscillator.frequency.value = NoteFrequency[noteToPlay]; // in hertz
	oscillator.start(myAudioContext.currentTime); 	
	sleep(1000); // wait for 1 seconds
	oscillator.stop(myAudioContext.currentTime); 
//	oscillator.disconnect(); 
	sleep(250); // wait for 0.25 seconds

   // Create an audio context for next note to be played 
	oscillator = myAudioContext.createOscillator(); 
	oscillator.connect(myAudioContext.destination); 
	oscillator.type = 0; // use sine wave 
		// 0 = Sine wave 
		// 1 = Square wave 
		// 2 = Sawtooth wave 
		// 3 = Triangle wave 
	oscillator.frequency.value = NoteFrequency[noteToPlay] * semitoneRatio; // in hertz
	oscillator.start(myAudioContext.currentTime);
	sleep(1000); // wait for 1 seconds	
	oscillator.stop(myAudioContext.currentTime)  
//	oscillator.disconnect(); 

  	sleep(250); // wait for 0.25 seconds
	RelativePitch.stopSound(); 
	resultCanvas.innerHTML="Answer Now";
	notePlaying = 1; 
  }; 
  
  // This function is used when generating new notes 
  RelativePitch.stopSound = function()
  {
    oscillator.stop(0); 
	notePlaying = 0; 
   // Create an audio context for next note to be played 
	oscillator = myAudioContext.createOscillator(); 
	oscillator.connect(myAudioContext.destination); 
	oscillator.type = 0; // use sine wave 
		// 0 = Sine wave 
		// 1 = Square wave 
		// 2 = Sawtooth wave 
		// 3 = Triangle wave 
	oscillator.frequency.value = NoteFrequency[noteToPlay]; // in hertz
  }; 
  
    RelativePitch.setAnswer = function(value)
	{
		relationGuessed = value; 
		this.checkAnswer(); 
	}; 
  
    RelativePitch.checkAnswer = function()
	{
		// Different octaves must be a power of the root note. 
		if (relationGuessed ==  semitones) 
		{
			resultCanvas.innerHTML="Correct";

			$.ajax({
                type: 'PUT',
                data: 1,
                url: '/games/3/' + new Date().getTime(),
                cache: false
            });
		}
		else 
		{ 
			resultCanvas.innerHTML="Wrong";
		}
			
	}; 
	
    RelativePitch.setDifficulty = function(value)
	{
		difficulty = value; 
		if (value == 4)
		{
			difficultyCanvas.innerHTML="Difficulty: Easy";
		}
		else if(value == 8) 
		{
			difficultyCanvas.innerHTML="Difficulty: Medium";
		}
		else
		{
			difficultyCanvas.innerHTML="Difficulty: Hard";
		}

	}; 

  return RelativePitch;
})(); // This is the syntax for creating a class in Javascript 

// Initialize the page.
window.onload = function() 
{
  var relativePitch = new RelativePitch();

}

function sleep(ms)
{
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime());
}
