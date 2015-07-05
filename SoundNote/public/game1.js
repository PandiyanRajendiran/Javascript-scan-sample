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

// Chords Table (numbers refer to semitone table) 
// Major         : 0-4-7 	 (e.g. C-E-G )
// Minor         : 0-3-7 	 (e.g. C-D#-G)
// Major7th      : 0-4-7-11  (e.g. C-E-G-A#)
// PowerChord    : 0-7 	     (e.g. C-G) 
// Diminished    : 0-3-6     (e.g. C-D#-F#)
// Diminished7th : 0-3-6-9	 (e.g. C-D#-F#-A) 
// Augmented	 : 0-4-8	 (e.g. C-E-G#)
// Suspended2nd  : 0-2-7	 (e.g. C-D-G) 
// Suspended4th  : 0-5-7 	 (e.g. C-F-G)  

var ChordIdenfitifer = (function() 
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

  // To limit the number of notes that can be played 
  var difficulty; // 4=> 4 semitones, 8 => 8 semitones, 13 => all the way up to 12 semitones => octave 
    // Anything lower or higher and speakers can't really play it
	// 220 = A3 is the lowest it can go with difficulty 1
  
  var notePlaying;
				   // 1 => notes are being played
				   // 0 => no notes are being played 
				   
  // Chord variables 
  var	chordFreq; 
  var	chordLength ; // can be 2 notes, 3 notes, or 4 notes. 
  var	i; // for loops 
  var chordType;  // chordTypeGenerated 
  // 1 : Major
  // 2 : Minor
  // 3 : Major7
  // 4 : PowerChord 
  var chordGuessed; // current chord guessed by player (in frequency) 
 
    // Constructor
  var ChordIdenfitifer = function() 
  {
  	// A3 -> G#4 
    NoteFrequency = [220.00, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00];  
    myAudioContext = new webkitAudioContext(); // Note: There is a limit to how many webkitAudioContext() you can make, exceed this and no sound is played. 
    chordFreq = [261.63, 329.63, 392.00, 0, 0, 0]; // initialize to random chord, max of 6 notes 
	chordLength = 3; // initialize to 3 note chord 
	resultCanvas = document.getElementById('Result');
	difficultyCanvas = document.getElementById('Difficulty'); 
	difficulty = 3; // from 1-9 (the number of available chordType) 
			// Easy: 3
			// Medium: 6
			// Hard: 9 
    noteToPlay = Math.floor(Math.random() * 13); // Generate random number between 0 - 12 to play a random note 
	semitones = 0; // initialize with 0 semitones => unison 
	lengthOfNote = 1; // play notes for 1 second 
	noteToPlay = Math.floor(Math.random() * 13); // Generate random number between 0 - 12 to play a random note 
		chordType = Math.floor(Math.random() * difficulty) + 1; // generate random number between 1 - difficulty 
		switch(chordType)
		{
			case 1: // Major (0-4-7)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (4/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 4
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				break;
			case 2:  // Minor (0-3-7)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (3/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 3
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				break; 
			case 3:  // Major7th  (0-4-7-11) 
				chordLength = 4; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (4/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 4
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				semitoneRatio = Math.pow(2, (11/12)); 
				chordFreq[3] = chordFreq[0] * semitoneRatio; //11
				break; 
			case 4:  // PowerChord (0-7)
				chordLength = 2; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 7
				break; 
			case 5: // Diminished     (0-3-6)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (3/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 3
				semitoneRatio = Math.pow(2, (6/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 6
				break; 
			case 6: // Diminished7th  (0-3-6-9)
				chordLength = 4; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (3/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 3
				semitoneRatio = Math.pow(2, (6/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 6
				semitoneRatio = Math.pow(2, (9/12)); 
				chordFreq[3] = chordFreq[0] * semitoneRatio; // 9
				break; 
			case 7: // Augmented	  (0-4-8)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (4/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 4
				semitoneRatio = Math.pow(2, (8/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 8
				break; 
			case 8: //  Suspended2nd  (0-2-7)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (2/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 2
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				break; 
			case 9: //  Suspended4th  (0-5-7)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (5/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 5
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				break; 
			default:  // Major (0-4-7)
				chordType = 1; // reset to 1 
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (4/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 4
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				break; 
		}
	for(i=0;i<chordLength;i++) 
	{
		oscillator = myAudioContext.createOscillator(); // create oscillator for each note 
		gainNode = myAudioContext.createGain();
		oscillator.frequency.value = chordFreq[i];
		oscillator.type = 0; // use sine wave 
		oscillator.connect(gainNode); // connect it to gain node 
		gainNode.gain.value = 0.25;
		gainNode.connect(myAudioContext.destination); // connect gain to destination 
		oscillator.start(0);
		setTimeout(function(s) {s.stop(0)}, 1000, oscillator);
	}
//	resultCanvas.innerHTML="New Chords Generated, Play Again";

  };
  
  
  ChordIdenfitifer.generateNewChord = function()
  {
		noteToPlay = Math.floor(Math.random() * 13); // Generate random number between 0 - 12 to play a random note 
		chordType = Math.floor(Math.random() * difficulty) + 1; // generate random number between 1 - difficulty 
		switch(chordType)
		{
			case 1: // Major (0-4-7)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (4/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 4
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				break;
			case 2:  // Minor (0-3-7)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (3/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 3
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				break; 
			case 3:  // Major7th  (0-4-7-11) 
				chordLength = 4; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (4/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 4
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				semitoneRatio = Math.pow(2, (11/12)); 
				chordFreq[3] = chordFreq[0] * semitoneRatio; //11
				break; 
			case 4:  // PowerChord (0-7)
				chordLength = 2; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 7
				break; 
			case 5: // Diminished     (0-3-6)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (3/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 3
				semitoneRatio = Math.pow(2, (6/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 6
				break; 
			case 6: // Diminished7th  (0-3-6-9)
				chordLength = 4; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (3/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 3
				semitoneRatio = Math.pow(2, (6/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 6
				semitoneRatio = Math.pow(2, (9/12)); 
				chordFreq[3] = chordFreq[0] * semitoneRatio; // 9
				break; 
			case 7: // Augmented	  (0-4-8)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (4/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 4
				semitoneRatio = Math.pow(2, (8/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 8
				break; 
			case 8: //  Suspended2nd  (0-2-7)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (2/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 2
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				break; 
			case 9: //  Suspended4th  (0-5-7)
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (5/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 5
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				break; 
			default:  // Major (0-4-7)
				chordType = 1; // reset to 1 
				chordLength = 3; 
				chordFreq[0] =  NoteFrequency[noteToPlay]; // 0 
				semitoneRatio = Math.pow(2, (4/12)); 
				chordFreq[1] = chordFreq[0] * semitoneRatio; // 4
				semitoneRatio = Math.pow(2, (7/12)); 
				chordFreq[2] = chordFreq[0] * semitoneRatio; // 7
				break; 
		}
		resultCanvas.innerHTML="New Chords Generated, Play Again";
		ChordIdenfitifer.stopSound(); 
  }

  
  ChordIdenfitifer.playSound = function()
  {
	for(i=0;i<chordLength;i++) 
	{
		oscillator = myAudioContext.createOscillator(); // create oscillator for each note 
		gainNode = myAudioContext.createGain();
		oscillator.frequency.value = chordFreq[i];
		oscillator.type = 0; // use sine wave 
		oscillator.connect(gainNode); // connect it to gain node 
		gainNode.gain.value = 0.25;
		gainNode.connect(myAudioContext.destination); // connect gain to destination 
		oscillator.start(0);
		setTimeout(function(s) {s.stop(0)}, 1000, oscillator);
	}
	resultCanvas.innerHTML="Answer Now";
	notePlaying = 1; 
  }; 
  
    ChordIdenfitifer.setAnswer = function(value)
	{
		chordGuessed = value; 
		this.checkAnswer(); 
	}; 
  
    ChordIdenfitifer.checkAnswer = function()
	{
		// Different octaves must be a power of the root note. 
		if (chordGuessed ==  chordType) 
		{
			resultCanvas.innerHTML="Correct";
            
			$.ajax({
                type: 'PUT',
                data: 1,
                url: '/games/1/' + new Date().getTime(),
                cache: false
            });
		}
		else 
		{ 
			resultCanvas.innerHTML="Wrong";
		}
	}; 
	
    ChordIdenfitifer.setDifficulty = function(value)
	{
		difficulty = value; 
		if (value == 3)
		{
			difficultyCanvas.innerHTML="Difficulty: Easy";
		}
		else if(value == 6) 
		{
			difficultyCanvas.innerHTML="Difficulty: Medium";
		}
		else // 9 is max 
		{
			difficultyCanvas.innerHTML="Difficulty: Hard";
		}
	}; 
  return ChordIdenfitifer;
})(); // This is the syntax for creating a class in Javascript 

// Initialize the page.
window.onload = function() 
{
  var chordIdenfitifer = new ChordIdenfitifer();
}

function sleep(ms)
{
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime());
}
