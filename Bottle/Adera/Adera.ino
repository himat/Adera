// Define the pins we're going to call pinMode on
int amp = A0;  // Weight to this one
int capRead = D7; //

int analogInputWeight = 0;
double weightValue = 0;
double pills = 0;
int apxPillCount = 0;
int capStatus = 0;

int previousCapStatus = 0;

char capStr[64];
char weightStr[64];
char pillCountStr[64];

unsigned long lastTime = 0UL;

char thisID[64];

// This routine runs only once upon reset
void setup() {
  Time.zone(5);
  Spark.variable("pills", &pills, DOUBLE);
  Spark.variable("apxPillCount", &apxPillCount, INT);
  Spark.variable("capStatus", &capStatus, INT);
  pinMode(amp, INPUT);
  pinMode(capRead, INPUT);

  //thisID = Spark.deviceID();
  Spark.deviceID().toCharArray(thisID, 64);
  Spark.variable("coreID", &thisID, STRING);
}

// This routine gets called repeatedly, like once every 5-15 milliseconds.
// Spark firmware interleaves background CPU activity associated with WiFi + Cloud activity with your code.
// Make sure none of your code delays or blocks for too long (like more than 5 seconds), or weird things can happen.
void loop() {

  unsigned long now = millis();

  capStatus = digitalRead(capRead);
  analogInputWeight = analogRead(amp);
  weightValue = (analogInputWeight * 3.308)/4096;

  pills = weightValue - (0.156 + 0.260);//0.56;
  apxPillCount = constrain(pills * 120 / 1.61, 0, 120);


  if(previousCapStatus != capStatus)
  {
    lastTime = now;
    previousCapStatus = capStatus;
  }

  if (now-lastTime>1500UL && lastTime != 0)
  {
        lastTime = 0;
        if(capStatus)//Cap on
        {
          sprintf(capStr,"%d",capStatus);
          Spark.publish("capOn",capStr);

          sprintf(pillCountStr,"%d",apxPillCount);
          Spark.publish("apxPillCount",pillCountStr);

        }
        else//Cap off
        {
          sprintf(capStr,"%d",capStatus);
          Spark.publish("capOff", capStr);

        }


  }
  //delay(500);

}
