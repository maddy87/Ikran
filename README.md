#Ikran - Banking Simplified Using Voice Commands

Ikran is a Banking Application that can help you with minimal banking needs just by using your voice commands. 
The below technologies were used to build the application. 

* [AWS Lambda](https://aws.amazon.com/lambda/)
* [Alexa in the Browser](https://github.com/sammachin/alexaweb)
* [Microsoft Cognitive Services](https://www.microsoft.com/cognitive-services)
* [Nessie API's by Capital Once](http://api.reimaginebanking.com)
* [Cycle](http://cycle.io)


##Installation
The application contains many modules that needed to be separate to avoid complexity, I tried my best to push them to a cloud and make then talk to each other as microservices but the lag during the round trip was horrible so had to keep this local.

1. Clone this project or Download that ZIP file
2. Make sure you have [bower](http://bower.io/), [docker](https://www.docker.com) and  [pip](https://pypi.python.org/pypi/pip) installed globally
3. On the command prompt run the following commands
- `cd project-directory`
- `cd alexaweb` and follow the instructions in its README
- run `python app.py' . This runs your Alexa Web app in the front end.
- You will need an Alexa developer account to access Alexa features.
- Pull down the image from docker using `docker pull rajeshetty/microsoftcognitiveservices`
- run ` docker run -it --name <nameofcontainer> -p 8888:8888 -v /local/volume:/contianervolume rajeshetty/microsoftcognitiveservices`
- `cd Cognitive-SpeakerRecognition-Python/server`
- `node app.js` this helps running the local version of the API which performs the Speaker recognition for you.
- All banking services are written in a node js app available in  a docker container
-  Pull down the image from docker using `docker pull rajeshetty/microsoftcognitiveservices`


##Voice Interaction

Below are the Alexa commands that are available to interact with the user,

"Alexa start Eekran"
"Alexa ask Eekran What is my balance"
"Alexa ask Ekran Transfer thousand dollars to Ash". This command will actually transfer me all your money.


##Talk Docker to me

I already did.

##Credits

- Thank you for Sam's hack, my life became much easier[Alexa on the Web](https://github.com/sammachin/alexaweb).
- Web version of Microsoft Cognitive API's was not happy with me, so had to tweak [this](https://github.com/Microsoft/Cognitive-SpeakerRecognition-Python.git) sample repo for hacking
- Cycle for being so easy to use.