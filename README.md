# Raspberry Pi Server for Device Kiosk


Back-end code built in Angular for a Raspberry Pi Startec REGISTRO Device Kiosk. 

A REGISTRO Kiosk is a QR ID data parser (scanner) and storage server for the contact tracing system. The QR scanner retrieves customer information by scanning a QR code customers provide. This information is then stored by the device server into a database in memory. Data can be easily accessed and downloaded (remotely) from the device through the data administration portal (included in this codebase) for use in contact tracing.

## STARTEC REGISTRO

Startec REGISTRO is an open-source COVID case contact tracing system for small and medium sized establishments and organizations, created by Startec Innovations, a technology adoption and innovation consultancy firm based in the Philippines. 

Learn more about Startec and REGISTRO [here](https://www.facebook.com/startec.ideators).

The developers of this project use [npm](https://www.npmjs.com/) ❤️

Device Fabrication Instructions
-------
A full guide in how to build this device can be found [here](https://hackaday.io/project/176352/instructions)

Follow us on [Hackaday](https://hackaday.io/StartecInnovations) and [Facebook](https://www.facebook.com/startec.ideators) for Updates and Important Info

Development
-------
This build was developed for a *Raspberry Pi 3 B+* on *Raspbian Buster*. It will also work for the Raspberry Pi Zero W and Raspberry Pi 4 boards.

### Setting Up the Server

The following packages are needed to be installed and configured in the Raspberry Pi in order to run this server:
* apache2 (Apache 2 Web Server)
* php (A PHP distribution)
* libapache2-mod-php (For Enabling PHP on the Web Server)
* mariadb-server (Maria-DB or mySQL)
* Node JS and NPM


### Device Deployment
After setting up the environment, clone the [repository](https://github.com/startec-official/registro-raspi-server) into your device. A `.env` is needed for server configuration.
To do so, navigate to the folder of the cloned repository, (named `registro-raspi-server`) and create a `.env` file with the following contents.
```
HOST_NAME = 'localhost'
DB_USER = 'user'
password = 'password'
database = registro
PORT = 3000
APP_NAME = 'registro' 
then run `npm start`
```
change `user` and `password` to the username and password you will use to access the mySQL database.

After generating this file, run `npm start`. The server will be running.

Contributions
-------
Please feel free to drop as an email for potential contributions.
Contact Us through [startec.innovations@gmail.com](mailto:startec.innovations@gmail.com)

LICENSE and Use
-------
Please refer to the `LICENSE.md` file for more information.

This project is covered by the BSD License.
© 2020 | Startec Innovations
