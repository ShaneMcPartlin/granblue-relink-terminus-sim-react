import { useState } from "react";
import { Button, Image } from "@chakra-ui/react";
import characterData from "./characterData.json";
import "./App.css";

type Character = {
  name: string;
  characterImg: string;
  weaponImg: string;
  unlocked: boolean;
  hasWeapon: boolean;
};

const defaultCharacterArray = characterData as Character[];

function App() {
  const [characterArray, setCharacterArray] = useState<Character[]>(
    defaultCharacterArray
  );
  const [resultsText, setResultsText] = useState<string[]>([]);

  const getRandomIntUpTo = (max: number): number => {
    return Math.floor(Math.random() * max);
  };

  const checkWeaponReward = (): boolean => {
    return Math.floor(Math.random() * 10) === 0;
  };

  const clickCharacter = (index: number) => {
    const newCharacterArray = [...characterArray];
    newCharacterArray[index].unlocked = !characterArray[index].unlocked;
    setCharacterArray(newCharacterArray);
  };

  const updateResultsText = (newMessage: string): void => {
    setResultsText([newMessage, ...resultsText]);
  };

  const rollRewards = () => {
    const noWeaponsArray = [...characterArray].filter(
      (character: Character) => {
        return character.hasWeapon === false;
      }
    );
    // don't get shit if you already have them all
    if (noWeaponsArray.length === 0) {
      updateResultsText("Player already has all weapons");
      return;
    }
    // check if there's a weapon reward at all
    if (checkWeaponReward()) {
      const weaponRoll = getRandomIntUpTo(noWeaponsArray.length);
      // check if player has character for rolled weapon
      if (noWeaponsArray[weaponRoll].unlocked) {
        // give weapon

        // connect the filtered array back to the full array
        const winningCharacterName = noWeaponsArray[weaponRoll].name;
        const winningCharacterIndex = characterArray.findIndex(
          (character: Character) => character.name === winningCharacterName
        );

        // update the state
        const newCharacterArray = [...characterArray];
        newCharacterArray[winningCharacterIndex].hasWeapon = true;
        setCharacterArray(newCharacterArray);
        updateResultsText(
          `Player got ${newCharacterArray[winningCharacterIndex].name}'s weapon`
        );
      } else {
        updateResultsText(
          `Player would've gotten a weapon if they had ${noWeaponsArray[weaponRoll].name}`
        );
      }
    } else {
      updateResultsText("Player didn't get a weapon");
    }
  };

  const rollUntilAllUnlockedCharactersHaveWeapons = () => {
    let loopCount = 0;
    let unlockedCharactersArray = [...characterArray].filter((character) => {
      return character.unlocked;
    });
    const characterDoesNotHaveWeapon = (character: Character) =>
      character.hasWeapon === false;
    while (unlockedCharactersArray.some(characterDoesNotHaveWeapon)) {
      console.log("loop");
      rollRewards();
      unlockedCharactersArray = [...characterArray].filter((character) => {
        return character.unlocked;
      });
      ++loopCount;
    }
    updateResultsText(`Player got all weapons after ${loopCount} runs`);
  };

  const resetState = () => {
    console.log("click");
    const freshCharacterArray = [...characterArray].map((character) => {
      return {
        name: character.name,
        characterImg: character.characterImg,
        weaponImg: character.weaponImg,
        unlocked: false,
        hasWeapon: false,
      } as Character;
    });
    setCharacterArray(freshCharacterArray);
    setResultsText([]);
  };

  const characterImages = characterArray.map((character, index) => {
    return (
      <div
        key={character.name}
        className="thumbnail-container"
        onClick={() => {
          clickCharacter(index);
        }}
      >
        <Image
          className={`character-pic  ${character.unlocked ? "" : "dimmed"}`}
          src={character.characterImg}
          alt={character.name}
        />
        {character.hasWeapon ? (
          <img
            className="weapon-pic"
            src={character.weaponImg}
            alt={`${character.name} weapon`}
          />
        ) : (
          <></>
        )}
      </div>
    );
  });

  const resultsTextLog = (
    <ol reversed>
      {resultsText.map((result) => {
        return <li>{result}</li>;
      })}
    </ol>
  );

  return (
    <>
      <div className="two-col-flex">
        <div className="image-grid">{characterImages}</div>
        <div className="text-log">{resultsTextLog}</div>
      </div>
      <Button size="lg" onClick={rollRewards}>
        Kill Proto Bahamut
      </Button>
      <Button size="lg" onClick={rollUntilAllUnlockedCharactersHaveWeapons}>
        Kill Proto Bahamut until all unlocked characters have weapons
      </Button>
      <Button size="lg" onClick={resetState}>
        Reset
      </Button>
    </>
  );
}

export default App;
