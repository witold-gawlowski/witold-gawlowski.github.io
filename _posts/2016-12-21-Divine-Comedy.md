---
layout: default
title: Divine Comedy
category: projects
note: 3D falling arcade game, where you use gun knockback to move around levels. Made in unreal.
weight: 2560
---

<iframe width="550" height="330" src="https://www.youtube.com/embed/tp4iswLyc2g" frameborder="0" allowfullscreen></iframe>
<iframe width="550" height="330" src="https://www.youtube.com/embed/RJGxkLovREM" frameborder="0" allowfullscreen></iframe>

It was created using Unreal Engine, C++. Developed in a team of 2 with [Nikita Veselov](https://www.nick-veselov.com/).
I was technical lead of this project as well as came up with the concept of the game.  

Unique features:  
* Dynamic pitch axis: it gets angled when player is falling down.  
* Procedural cave geneation using Convay's game of life. Based on [this](https://gamedevelopment.tutsplus.com/tutorials/generate-random-cave-levels-using-cellular-automata--gamedev-9664) article but we have
generalized it to 3D.  


[![alt](https://goo.gl/images/7aBJqx)](https://github.com/witold-gawlowski/DivineComedy)

```c++
void ADivineCameraManager::ProcessViewRotation (float DeltaTime, FRotator& OutViewRotation, FRotator& OutDeltaRot) {
 ...
  //Calculate the rotation.
  FRotator NewOutViewRotation;
  FQuat OutQuat (OutViewRotation);
  FQuat YawQuat (rotAxis, OutDeltaRot.Yaw*Sensitivity/10000);
  FQuat PitchQuat (FVector (0, 1, 0), -OutDeltaRot.Pitch*Sensitivity/10000);
  FRotator result = FRotator (YawQuat*OutQuat*PitchQuat);
  //TODO: If a change from last frame is non-infinitesimal, don't do it.
  NewOutViewRotation = FRotator (result);
  ...
  //when in standing mode
  if ( DownFallCameraMode == false )
  {
    if ( NewOutViewRotation.Roll > RollToleranceMargin ) {
      NewOutViewRotation.Roll -= DeltaTime * RollRecoverySpeedParameter*FMath::Abs(NewOutViewRotation.Roll);
    } else if ( NewOutViewRotation.Roll < -RollToleranceMargin ) {
      NewOutViewRotation.Roll += DeltaTime * RollRecoverySpeedParameter*FMath::Abs (NewOutViewRotation.Roll);
    }
  }
  ...  
```
