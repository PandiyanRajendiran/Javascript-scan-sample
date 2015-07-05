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

var PerfectPitch = (function() 
{
  // HTML Element IDs
  // To print Results
  var resultCanvas; 
  var difficultyCanvas; 

  // Private Variables for both Perfect Pitch and Relative Pitch Games 
  var myAudioContext; // audio context used 
  var oscillator;
  var gainNode;
  var frequencyOne; // current frequency being played one
  var frequencyTwo; // current frequency being played two 
 
  // Changing notes each time  (for Perfect Pitch) 
  var NoteFrequency; // Available notes to play 
  var noteToMultiply; // which octave to multiply frequency by 

  var noteToPlay;  // current note played by player (not in frequency) 
  var noteGuessed; // current note guessed by player (in frequency) 

  // To limit the number of notes that can be played 
  var difficulty; // 1 => 1 octave, 2 => 2 octaves, 3 => 3 octaves 
    // Anything lower or higher and speakers can't really play it
	// 220 = A3 is the lowest it can go with difficulty 1
	// 1661.22 = G#5 is the highest it can go  with difficulty 3
  
  var notePlaying;
				   // 1 => a note is being played
				   // 0 => no note is being played 
  
    // Constructor
  var PerfectPitch = function() 
  {
				// A3 -> G#4 
    NoteFrequency = [220.00, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30];
	resultCanvas = document.getElementById('Result');
	difficultyCanvas = document.getElementById('Difficulty'); 
	difficulty = 1; // Difficulty must be an integer more than or equal to 1 
    noteToPlay = Math.floor(Math.random() * 12); // Generate random number between 0 - 11 
	noteToMultiply = Math.pow(2, (Math.floor(Math.random() * difficulty)));	
    // Create an audio context.
    myAudioContext = new webkitAudioContext(); // Note: There's a limit to how many you can create, after a certain point, no sound is heard. 
	oscillator = myAudioContext.createOscillator(); 
	oscillator.connect(myAudioContext.destination); 
	oscillator.type = 0; // use sine wave 
		// 0 = Sine wave 
		// 1 = Square wave 
		// 2 = Sawtooth wave 
		// 3 = Triangle wave 
	oscillator.frequency.value = NoteFrequency[noteToPlay] * noteToMultiply; // in hertz
	oscillator.start(0); //0 seconds 	
	notePlaying = 1; 
  };
  
  PerfectPitch.generateNewNote = function()
  {
		noteToPlay = Math.floor(Math.random() * 13); // Generate random number between 0 - 12 
		noteToMultiply = Math.pow(2, (Math.floor(Math.random() * difficulty))); // generate a random number between 0 - difficulty level, 2^(number generated) 
															// which means the number can be 2^0 = 1, 2^1 = 2, 2^2 = 4, etc. since remains same note 
															// but different octave 
		resultCanvas.innerHTML="New Note Generated, Play Again";
		PerfectPitch.stopSound(); 
  }

  
  PerfectPitch.playSound = function()
  {
	oscillator.frequency.value = NoteFrequency[noteToPlay] * noteToMultiply; // in hertz
	oscillator.start(0); 
	notePlaying = 1;
  }; 
  
  PerfectPitch.stopSound = function()
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
	oscillator.frequency.value = NoteFrequency[noteToPlay] * noteToMultiply; // in hertz
  }; 
  
    PerfectPitch.setAnswer = function(value)
	{
		if (notePlaying == 1)
		{
			noteGuessed = value; 
			this.checkAnswer(); 
		}
		else 
		{
			resultCanvas.innerHTML="Sound wasn't played";
		}
	}; 
  
    PerfectPitch.checkAnswer = function()
	{
		// Different octaves must be a power of the root note. 
		if ( ((NoteFrequency[noteToPlay] * noteToMultiply) % noteGuessed) == 0) 
		{
			resultCanvas.innerHTML="Correct";
            
			$.ajax({
                type: 'PUT',
                data: 1,
                url: '/games/2/' + new Date().getTime(),
                cache: false
            });
		}
		else 
		{ 
			resultCanvas.innerHTML="Wrong";
		}
			
	}; 
	
    PerfectPitch.setDifficulty = function(value)
	{
		difficulty = value; 
		if (value == 1)
		{
			difficultyCanvas.innerHTML="Difficulty: Easy";
		}
		else if(value == 2) 
		{
			difficultyCanvas.innerHTML="Difficulty: Medium";
		}
		else
		{
			difficultyCanvas.innerHTML="Difficulty: Hard";
		}

	}; 

  return PerfectPitch;
})(); // This is the syntax for creating a class in Javascript 

// Initialize the page.
window.onload = function() 
{
  var perfectPitch = new PerfectPitch();
}
