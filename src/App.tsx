import React, { FC } from 'react'
import Radar from './components/Radar'


const defaultBlips = [ // make desc compusaory
  { quadrant: 'Thanos', name: 'Nagging', score: 5, desc: 'Fun isn\'t something one considers when balancing the universe.'},
  { quadrant: 'Thanos', name: 'Snap finger', score: 5, desc: 'You\'re strong. But I could snap my fingers, and you\'d all cease to exist.'},
  { quadrant: 'Thanos', name: 'Immortal', score: 5, desc: 'Fun isn\'t something one considers when balancing the universe. But this... does put a smile on my face.'},
  { quadrant: 'Thanos', name: 'Telekinesis', score: 2, desc: 'Come. Let me help you.'},
  { quadrant: 'Thanos', name: 'Obsession with earth', score: 2, desc: 'To feel so desperately that you\'re right, yet to fail nonetheless.'},
  { quadrant: 'Thanos', name: 'Telepathy', score: 2, desc: 'You should have gone for the head.'},
  { quadrant: 'Thanos', name: 'Strategy', score: 1, desc: 'When I\'m done, half of humanity will still exist. Perfectly balanced'},

  { quadrant: 'Deadpool', name: 'Break 4th wall', score: 5, desc: 'No. You\'re blind.'},
  { quadrant: 'Deadpool', name: 'Pain insensitve', score: 4, desc: 'Oh, hello there! I bet you\'re wondering, why the red suit? Well, that\'s so bad guys can\'t see me bleed!'},
  { quadrant: 'Deadpool', name: 'Swording', score: 4, desc: 'Listen, the day I decide to become a crime-fighting shit swizzler who rooms with ava bunch of other little whiners at the Neverland Mansion of some creepy, old, bald, Heaven\'s Gate-looking motherfucker…'},
  { quadrant: 'Deadpool', name: 'Multilingual', score: 4, desc: 'Sorry, I use humor to deflect my insecurities.'},
  { quadrant: 'Deadpool', name: 'Accelerated healing', score: 3, desc: 'Yeah. That is a gun in my pants. But that doesn\'t mean I\'m not happy to see you...'},
  { quadrant: 'Deadpool', name: 'Gun shooting', score: 3, desc: 'You can\'t buy love, but you can rent it for three minutes!'},
  { quadrant: 'Deadpool', name: 'Savate', score: 3, desc: 'Never underestimate the stupidity of idiots.'},
  { quadrant: 'Deadpool', name: 'Kniving', score: 3, desc: 'Four or five moments'},
  { quadrant: 'Deadpool', name: 'Immortal', score: 2, desc: 'I want to die a natural death at the age of 102 – like the city of Detroit.'},
  { quadrant: 'Deadpool', name: 'Assassination', score: 2, desc: 'Okay guys, I only have twelve bullets, so you\'re all going to have to share!'},

  { quadrant: 'Iron Man', name: 'Rich', score: 5, desc: 'I am definitely richer than Batman'},
  { quadrant: 'Iron Man', name: 'Armoring', score: 5, desc: 'I did you a big favor. I have successfully privatized world peace. What more do you want?'},
  { quadrant: 'Iron Man', name: 'Computer Science', score: 4, desc: 'Following\'s not really my style.'},
  { quadrant: 'Iron Man', name: 'Quantum Mechanics', score: 4, desc: 'Stay out-of-the-way.'},
  { quadrant: 'Iron Man', name: 'Electrical Engineering', score: 3, desc: 'It\'s working. We\'re safe. America is secure.'},
  { quadrant: 'Iron Man', name: 'Fly', score: 2, desc: 'Jarvis, sometimes you gotta run before you can walk.'},
  { quadrant: 'Iron Man', name: 'Mathematics', score: 2, desc: '1 + 1 ≠ 2'},
  { quadrant: 'Iron Man', name: 'Physics', score: 2, desc: 'I told you, I don\'t want to join your super secret boy band.'},
  { quadrant: 'Iron Man', name: 'Mechanical Engineering', score: 2, desc: 'My name is Tony Stark and I\'m not afraid of you.'},
  { quadrant: 'Iron Man', name: 'AI', score: 2, desc: 'I am Iron Man'},

  { quadrant: 'Black Widow', name: 'Freelancing', score: 5, desc: 'I\'m multitasking.'},
  { quadrant: 'Black Widow', name: 'Psychological Manipulation', score: 5, desc: 'The person who developed this is slightly smarter than me. Slightly.'},
  { quadrant: 'Black Widow', name: 'Kong Fu', score: 5, desc: 'I\'m sorry. Did I step on your moment?'},
  { quadrant: 'Black Widow', name: 'Ballerina', score: 4, desc: 'I only ACT like I know everything.'},
  { quadrant: 'Black Widow', name: 'Judo', score: 4, desc: 'He\'s also a huge dork. Chicks dig that!'},
  { quadrant: 'Black Widow', name: 'Karate', score: 4, desc: 'Eyes on the road.'},
  { quadrant: 'Black Widow', name: 'Ageless', score: 3, desc: 'It was quite the buzz around here, finding you in the ice. I thought Coulson was gonna swoon.'},
  { quadrant: 'Black Widow', name: 'Kenpo', score: 3, desc: 'I\'ll brief you on everything when you get back. But first, we need you to talk to the big guy.'},
  { quadrant: 'Black Widow', name: 'Savate', score: 5, desc: 'Loki is beyond reason, but he is of Asgard and he is my brother!'},
  { quadrant: 'Black Widow', name: 'Ninjutsu', score: 3, desc: 'Most of the intelligence community doesn\'t believe he exists. The ones that do call him the Winter Soldier. He\'s a ghost. You\'ll never find him.'},
  { quadrant: 'Black Widow', name: 'Aikido', score: 2, desc: 'When I first joined S.H.I.E.L.D., I thought it was going straight. But I guess I just traded in the KGB for HYDRA.'},
  { quadrant: 'Black Widow', name: 'Sambo', score: 2, desc: 'Public displays of affection make people uncomfortable.'},
  { quadrant: 'Black Widow', name: 'Boxing', score: 1, desc: 'Bye bye, bikinis'},
]

const App: FC = () => (
  <Radar blips={ defaultBlips } />
)

export default App
