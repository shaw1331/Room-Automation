#include <Arduino.h>
#include <ESP8266WiFi.h>
#include "SinricPro.h"
#include "SinricProSwitch.h"

#include <map>

#define WIFI_SSID         "Rkg"    
#define WIFI_PASS         "ritesh2801"
#define APP_KEY           "a91f73a9-4b41-4f68-95f6-72fd0fce5c63"      
#define APP_SECRET        "8f01f3c9-b7be-4b69-87fc-c4304cf97f23-46fc777c-b60b-488d-a8a9-0fbafe17eec3"   


#define device_ID_1   "62487e11753dc5aab4a083cd"
#define device_ID_2   "62487dd6d0fd258c5207e41a"



#define RelayPin1 5  
#define RelayPin2 4  


#define SwitchPin1 10  
#define SwitchPin2 0   


#define wifiLed   16   //D0

#define TACTILE_BUTTON 1

#define BAUD_RATE   9600

#define DEBOUNCE_TIME 250

typedef struct {     
  int relayPIN;
  int flipSwitchPIN;
} deviceConfig_t;

std::map<String, deviceConfig_t> devices = {
    {device_ID_1, {  RelayPin1, SwitchPin1 }},
    {device_ID_2, {  RelayPin2, SwitchPin2 }},
};

typedef struct {      
  String deviceId;
  bool lastFlipSwitchState;
  unsigned long lastFlipSwitchChange;
} flipSwitchConfig_t;

std::map<int, flipSwitchConfig_t> flipSwitches;    


void setupRelays() { 
  for (auto &device : devices) {           
    int relayPIN = device.second.relayPIN; 
    pinMode(relayPIN, OUTPUT);             
    digitalWrite(relayPIN, HIGH);
  }
}

void setupFlipSwitches() {
  for (auto &device : devices)  {                     // for each device (relay / flipSwitch combination)
    flipSwitchConfig_t flipSwitchConfig;              // create a new flipSwitch configuration

    flipSwitchConfig.deviceId = device.first;         // set the deviceId
    flipSwitchConfig.lastFlipSwitchChange = 0;        // set debounce time
    flipSwitchConfig.lastFlipSwitchState = true;     // set lastFlipSwitchState to false (LOW)--

    int flipSwitchPIN = device.second.flipSwitchPIN;  // get the flipSwitchPIN

    flipSwitches[flipSwitchPIN] = flipSwitchConfig;   // save the flipSwitch config to flipSwitches map
    pinMode(flipSwitchPIN, INPUT_PULLUP);                   // set the flipSwitch pin to INPUT
  }
}

bool onPowerState(String deviceId, bool &state)
{
  Serial.printf("%s: %s\r\n", deviceId.c_str(), state ? "on" : "off");
  int relayPIN = devices[deviceId].relayPIN; // get the relay pin for corresponding device
  digitalWrite(relayPIN, !state);             // set the new relay state
  return true;
}

void handleFlipSwitches() {
  unsigned long actualMillis = millis();                                          
  for (auto &flipSwitch : flipSwitches) {                                         
    unsigned long lastFlipSwitchChange = flipSwitch.second.lastFlipSwitchChange;  
    if (actualMillis - lastFlipSwitchChange > DEBOUNCE_TIME) {                    

      int flipSwitchPIN = flipSwitch.first;                                       
      bool lastFlipSwitchState = flipSwitch.second.lastFlipSwitchState;          
      bool flipSwitchState = digitalRead(flipSwitchPIN);                          
      if (flipSwitchState != lastFlipSwitchState) {                               
#ifdef TACTILE_BUTTON
        if (flipSwitchState) {                                                    
#endif      
          flipSwitch.second.lastFlipSwitchChange = actualMillis;                  
          String deviceId = flipSwitch.second.deviceId;                         
          int relayPIN = devices[deviceId].relayPIN;                             
          bool newRelayState = !digitalRead(relayPIN);                           
          digitalWrite(relayPIN, newRelayState);                                 

          SinricProSwitch &mySwitch = SinricPro[deviceId];                        
          mySwitch.sendPowerStateEvent(!newRelayState);                           
#ifdef TACTILE_BUTTON
        }
#endif      
        flipSwitch.second.lastFlipSwitchState = flipSwitchState;                  
      }
    }
  }
}

void setupWiFi()
{
  Serial.printf("\r\n[Wifi]: Connecting");
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.printf(".");
    delay(250);
  }
  digitalWrite(wifiLed, LOW);
  Serial.printf("connected!\r\n[WiFi]: IP-Address is %s\r\n", WiFi.localIP().toString().c_str());
}

void setupSinricPro()
{
  for (auto &device : devices)
  {
    const char *deviceId = device.first.c_str();
    SinricProSwitch &mySwitch = SinricPro[deviceId];
    mySwitch.onPowerState(onPowerState);
  }

  SinricPro.begin(APP_KEY, APP_SECRET);
  SinricPro.restoreDeviceStates(true);
}

void setup()
{
  Serial.begin(BAUD_RATE);

  pinMode(wifiLed, OUTPUT);
  digitalWrite(wifiLed, HIGH);

  setupRelays();
  setupFlipSwitches();
  setupWiFi();
  setupSinricPro();
}

void loop()
{
  SinricPro.handle();
  handleFlipSwitches();
}
