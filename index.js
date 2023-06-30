//js code

var kanak = {
  age: 2,
  subjective: "",
  objective: "",

  ssp_tactile: 35,
  ssp_tasteSmell: 20,
  ssp_move: 15,
  ssp_underSeek: 35,
  ssp_audiFilter: 30,
  ssp_lowEnergy: 30,
  ssp_visualAuditorySens: 25,
  
  //FEDC START
  fedc_stage1: 0,
  fedc_stage2: 0,
  fedc_stage3: 0,
  fedc_stage4: 0,
  problematicFEDCStage : [],
  //FEDC END
  
  //cognitive
  sustain_att: 1,
  selective_att: 1,
  basic_contept: 1,
  adjust_att:0,
  
  //communication
  c_receptive: 0,
  c_expressive: 1,
  foll_instruct: 0,
  eye_contact: 5,
  
  //SOCIAL
  sharing: 1,
  takeTurn: 1,
  waitSkill: 1,
  sitTolerance: 1,
  emoRegulation: 2,
  
  //BEHAVIOR
  beh_active: 1,
  beh_tantrum: 1,//5 minutes is 2
  hurt_other: 0,
  hurt_self: 0,
  beh_casting: 0,
  
  treatmentDone: [],
  problemList: [],
  shortTermG: [],
  longTermG: [],
  p_problems: [],
  p_progress: [],
  p_potential: [],
  intervention_plan: [],
  homeprogram: [],
};
	
const keyMapping = {
  ssp_tactile: "Tactile sensitivity",
  ssp_tasteSmell: "Taste and smell sensitivity",
  ssp_move: "Movement sensitivity",
  ssp_underSeek: "Under responsive/Seeking",
  ssp_audiFilter: "Auditory filtering",
  ssp_lowEnergy: "Low energy/Weak",
  ssp_visualAuditorySens: "Visual/Auditory Sensitivity",
};

function getSSPDetails(kanak) {
  let result = "";
  
  for (let key in kanak) {
    if (key in keyMapping) {
      result += `${keyMapping[key]} : ${kanak[key]}\n`;
    }
  }

  return result;
}	
	
	
function generateRndValueForProperties(obj, properties) { //generateRndValueForProperties(myObject, ['ssp_tactile', 'ssp_move']);
    const propertyGenerator = {
        ssp_tactile: () => Math.floor(Math.random() * (26 - 7 + 1)) + 7,
        ssp_tasteSmell: () => Math.floor(Math.random() * (11 - 4 + 1)) + 4,
        ssp_move: () => Math.floor(Math.random() * (10 - 3 + 1)) + 3,
        ssp_underSeek: () => Math.floor(Math.random() * (23 - 7 + 1)) + 7,
        ssp_audiFilter: () => Math.floor(Math.random() * (19 - 6 + 1)) + 6,
        ssp_lowEnergy: () => Math.floor(Math.random() * (23 - 6 + 1)) + 6,
        ssp_visualAuditorySens: () => Math.floor(Math.random() * (15 - 5 + 1)) + 5
    };

    properties.forEach(property => {
        if (propertyGenerator[property]) {
            obj[property] = propertyGenerator[property]();
        }
    });
}


function calculateSspTotalScore(obj) {
    return obj.ssp_tactile + obj.ssp_tasteSmell + obj.ssp_move + obj.ssp_underSeek + obj.ssp_audiFilter + obj.ssp_lowEnergy + obj.ssp_visualAuditorySens;
}

function getFEDCStages(obj) {
    let stages = {
        'fedc_stage1': 'Regulation,Interest in world',
        'fedc_stage2': 'Engagement',
        'fedc_stage3': 'Two way',
        'fedc_stage4': 'Shared Social Problem Solving'
    };
  
    let mastery = {
        0: 'None',
        1: 'Emergent',
        2: 'Partial mastery',
        3: 'Full mastery'
    };
  
    let result = '';
    for (let key in stages) {
        if (key in obj) {
            let stageNum = key.charAt(key.length - 1);
            result += `FEDC Stage ${stageNum} (${stages[key]}) : ${mastery[obj[key]]}\n`;
        }
    }
    return result;
}

function updateFedcStages(obj) {
    if (obj.fedc_stage4 >= 1) {
        obj.fedc_stage1 = obj.fedc_stage2 = obj.fedc_stage3 = 3;
    }
    if (obj.fedc_stage3 >= 1) {
        obj.fedc_stage1 = obj.fedc_stage2 = 3;
    }
    if (obj.fedc_stage2 >= 1) {
        obj.fedc_stage1 = 3;
    }
}

function getCheckedBoxes() {
    // Create an array to hold the names of checked boxes.
    var checkedBoxes = [];
  
    // Get a NodeList of all input elements of type checkbox.
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
    // Iterate through the NodeList, and if a checkbox is checked, 
    // remove 'forms' from its name and push it into the array.
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            // replace 'forms' with empty string to get desired names
            var name = checkboxes[i].name.replace('form', '');
            checkedBoxes.push(name);
        }
    }
  
    // Return the array of checked box names.
    return checkedBoxes;
}


function getSSPString(sspKeys) {
  const mappedKeys = sspKeys
    .map(key => keyMapping[key] || "")
    .filter(Boolean);

  if (mappedKeys.length === 0) {
    return "No difference found.";
  }

  const lastKey = mappedKeys.splice(mappedKeys.length - 1, 1);
  const joinedKeys = mappedKeys.length > 0 ? mappedKeys.join(', ') + ' and ' : '';
  return `Child has definite difference in ${joinedKeys}${lastKey} sensitivity`;
}


function checkSensorySensitivity(score) {
    if(score >= 155 && score <= 190) {
        return "Child has Typical performance in overall sensory sensitivity";
    } else if(score >= 142 && score < 155) {
        return "Child has Probable difference in overall sensory sensitivity";
    } else if(score >= 38 && score < 142) {
        return "Child has Definite difference in overall sensory sensitivity";
    } else {
        return "Invalid score";
    }
}


function updateKanakFedc() {
  const stages = ['fedc_stage1', 'fedc_stage2', 'fedc_stage3', 'fedc_stage4'];
  stages.forEach(stage => {
    let radios = document.querySelectorAll(`input[name="${stage}"]`);
    radios.forEach(radio => {
      if (radio.checked) {
        kanak[stage] = parseInt(radio.value);
      }
    });
  });
  //console.log(kanak); // prints the updated kanak object
}

function getCCSBDOM() {
  // Cognitive
  kanak.adjust_att = Number(document.querySelector('input[name="sustain_att"]:checked').value);
  kanak.selective_att = Number(document.querySelector('input[name="selective_att"]:checked').value);
  kanak.basic_concept = Number(document.querySelector('input[name="basic_concept"]:checked').value);
  
  // Communication
  kanak.c_receptive = Number(document.querySelector('input[name="c_receptive"]:checked').value);
  kanak.c_expressive = Number(document.querySelector('input[name="c_expressive"]:checked').value);
  kanak.foll_instruct = document.querySelector('input[name="formfoll_instruct"]').checked ? 1 : 0;
  kanak.eye_contact = Number(document.querySelector('input[name="formeye_contact"]').value);
  
  // Social
  kanak.sharing = Number(document.querySelector('input[name="formsharing"]:checked').value);
  kanak.takeTurn = Number(document.querySelector('input[name="formtakeTurn"]:checked').value);
  kanak.waitSkill = Number(document.querySelector('input[name="formwaitSkill"]:checked').value);
  kanak.emoRegulation = Number(document.querySelector('input[name="formemoRegulation"]:checked').value);
  
  // Behavior
  kanak.beh_active = Number(document.querySelector('input[name="formbeh_active"]:checked').value);
  kanak.beh_tantrum = Number(document.querySelector('input[name="formbeh_tantrum"]:checked').value);
  kanak.hurt_other = Number(document.querySelector('input[name="formhurt_other"]:checked').value);
  kanak.hurt_self = Number(document.querySelector('input[name="formhurt_self"]:checked').value);
  kanak.beh_casting = Number(document.querySelector('input[name="formbeh_casting"]:checked').value);
}




function interpretKanakCCSB() {
  const getRating = (val) => {
    if (val === 0) return 'Poor';
    if (val === 1) return 'Fair';
    if (val === 2) return 'Good';
  };

  const getRatingADJUST = (val) => {
    if (val === 4) return 'Poor';
    if (val === 2) return 'Fair';
    if (val === 0) return 'Good';
  };

  const getExpressiveness = (val) => {
    if (val === 0) return 'Only crying; no pulling hands';
    if (val === 1) return 'Pulls hands';
    if (val === 2) return 'Able to point; consistently able to express simple';
    if (val === 3) return 'Able to speak full sentence or able to point to multi-step meaning';
  };

  const getReceptiveness = (val) => {
    if (val === 0) return 'Does not understand pointing or one step';
    if (val === 1) return 'Understands one step';
    if (val === 2) return 'Understands two steps';
    if (val === 3) return 'Understands three steps';
  };

  const getYesNo = (val) => val === 0 ? 'No' : 'Yes';

  return `
3. Cognitive:
Sustain Attention: ${getRatingADJUST(kanak.adjust_att)} 
Selective Attention: ${getRating(kanak.selective_att)}
Basic Concept: ${getRating(kanak.basic_concept)}

4. Communication:
Receptive: ${getReceptiveness(kanak.c_receptive)}
Expressive: ${getExpressiveness(kanak.c_expressive)}
Follows Instructions: ${getYesNo(kanak.foll_instruct)}
Eye Contact (Rate from 1 to 10): ${kanak.eye_contact}

5. Social:
Sharing: ${getRating(kanak.sharing)}
Turn Taking: ${getRating(kanak.takeTurn)}
Waiting Skill: ${getRating(kanak.waitSkill)}
Emotional Regulation: ${getRating(kanak.emoRegulation)}

6. Behavior:
Behavior - Active Level: ${getRating(kanak.beh_active)}
Behavior - Tantrum Duration: ${getRating(kanak.beh_tantrum)}
Hurting Others: ${getYesNo(kanak.hurt_other)}
Self-harming Behavior: ${getYesNo(kanak.hurt_self)}
Behavior - Casting: ${getYesNo(kanak.beh_casting)}
  `;
}

function retrieveTxDoneDOM() {
    // Get elements from the DOM
    const textArea1 = document.getElementsByName('form_tx1')[0];
    const textArea2 = document.getElementsByName('form_tx2')[0];
    const textArea3 = document.getElementsByName('form_tx3')[0];

    // Get the values from the text areas
    const value1 = textArea1.value;
    const value2 = textArea2.value;
    const value3 = textArea3.value;

    // Add the values to the kanak.treatmentDone array
    kanak.treatmentDone.push(value1, value2, value3);
}

function formatTxDoneArray() {
    let result = "";
    for(let i = 0; i < kanak.treatmentDone.length; i++) {
        result += `${i+1}. ${kanak.treatmentDone[i]}\n`;
    }
    return result;
}


function updateAPpart(kanak) {
    //behavioural
    if (kanak.beh_tantrum === 1 || kanak.beh_tantrum === 2) {
        kanak.beh_tantrum === 1 ? 
        kanak.problemList.push("Child has maladaptive behavior - Tantrum for 15 minutes") :
        kanak.problemList.push("Child has maladaptive behavior - Tantrum for 30 minutes");
    }
    if (kanak.hurt_self === 1) {
        kanak.problemList.push("Child has maladaptive behavior - Hurting self");
    }
    if (kanak.hurt_other === 1) {
        kanak.problemList.push("Child has maladaptive behavior - Hurting others");
    }
    if (kanak.beh_casting === 1) {
        kanak.problemList.push("Child has maladaptive behavior - Casting stuff");
    }

    //sensory issues
    if (kanak.ssp_tactile < 27) {
      kanak.problemList.push("Child has tactile sensitivity issue");
    }
    if (kanak.ssp_tasteSmell < 12) {
      kanak.problemList.push("Child has Taste and Smell sensitivity issue");
    }
    if (kanak.ssp_move < 11) {
      kanak.problemList.push("Child has Movement sensitivity issue");
    }
    if (kanak.ssp_underSeek < 24) {
      kanak.problemList.push("Child has Underresponsive or seeking sensation issue");
    }
    if (kanak.ssp_audiFilter < 20) {
      kanak.problemList.push("Child has auditory filtering issue");
    }
    if (kanak.ssp_lowEnergy < 24) {
      kanak.problemList.push("Child has Low Energy sensory issue");
    }
    if (kanak.ssp_visualAuditorySens < 16) {
      kanak.problemList.push("Child has Visual and Auditory sensitivity issue");
    }

    //FEDC


    const stages = {
      1: "Regulation and Interest in the world",
      2: "Engaging and relating",
      3: "Two way communication",
      4: "Social Problem Solving"
    }
    
    for (let i = 1; i <= 4; i++) {
      let stageValue = kanak['fedc_stage' + i];
      if (stageValue > 0 && stageValue < 3) {
        let masteryLevel = (stageValue === 1) ? 'emergent' : 'partial mastery';
        let message = `Child has difficulty in Stage ${i} of ${stages[i]}, it is in ${masteryLevel}`;
        kanak.problemList.push(message);
      }
    }
    

    kanak.age = document.getElementsByName('form_age')[0].value;
    //Cognitive

    //process sustain attention
    var attentionSpans = {
      2: 4,
      3: 6,
      4: 8,
      5: 12,
      6: 14,
      7: 16,
      8: 18
  };
 
  if (kanak.age in attentionSpans) {
      kanak.sustain_att = attentionSpans[kanak.age];
  }
  if (kanak.adjust_att == 2 || kanak.adjust_att == 4) {
    kanak.sustain_att = kanak.sustain_att - kanak.adjust_att;
    const ADJASTED = (val) => {
      if (val === 0) return 'Good';
      if (val === 2) return 'Fair';
      if (val === 4) return 'Poor';
    }
    kanak.problemList.push(`Child has ${ADJASTED(kanak.adjust_att)} sustained attention of less than ${kanak.sustain_att} minutes `);
  }






    if (kanak.basic_concept < 2 ) {
    const BasCon = (val) => {
      if (val === 0) return 'Poor';
      if (val === 1) return 'Fair';
      if (val === 2) return 'Good';
    };
    kanak.problemList.push(`Child has ${BasCon(kanak.basic_concept)} basic concept `);
  };


}




function writeSOAP() {


  kanak.subjective = document.querySelector('textarea[name="soap_subjective"]').value;
	kanak.objective = document.querySelector('textarea[name="soap_objective"]').value;
	
	
	//SSP , Child has definite difference in Tactile and Movement sensitivity
	//
	generateRndValueForProperties(kanak,getCheckedBoxes());


	let SSP = "\nShort Sensory Profile : \n" + getSSPDetails(kanak) + "\n" + getSSPString(getCheckedBoxes()) + "\n" + "Total score :" + calculateSspTotalScore(kanak) + "/190" + "\n" + checkSensorySensitivity(calculateSspTotalScore(kanak)) + "\n";
	
	
	//FEDC
	updateKanakFedc();//get value from dom
	updateFedcStages(kanak);//corrected the previous stage
	let fedcFinal = "FEDC/FEAS assessment : \n" + getFEDCStages(kanak);//write proper string
	
	//CCSB
	getCCSBDOM();
	let CCSBfinal = interpretKanakCCSB();
  

  //treatment done
  kanak.treatmentDone = [];
  retrieveTxDoneDOM();
	let finalTreatmentDone = "Treamtment done: \n" + formatTxDoneArray();
  

  //problem list
  kanak.problemList = [];

  updateAPpart(kanak);


  //format the data for final output
  let problemList = kanak.problemList.map((problem, index) => `- ${problem}`).join('\n');
  let problemList2 = `Problem List:\n${problemList}`;
    
	let final_soap = document.getElementsByName("final_output")[0];

  console.log(kanak);
	final_soap.value = "Subjective :" + "\n" + kanak.subjective + "\n\n" + "Objective :" +  
	 "\n" + kanak.objective + "\n" + SSP + "\n" + fedcFinal + "\n" + CCSBfinal + "\n" + finalTreatmentDone + "\n" + problemList2;
}

