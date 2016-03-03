# geeksWeather

"&copy;" 2016 Ben Bailey

GNU GPLv2 licensed

Note: This code is not yet suitable for downloading, as it is still undergoing initial development!

This is a weather display that utilizes the Wunderground API for weather.

The API requires a 'key', which can be obtained from Wunderground.

This code does not supply a 'key'.  Instead, it expects to find a 'key' in a seperate file, called 'wundergroundKey.json'.  The format of the wundergroundKey.json file is (note - the key referenced is not a valid key, but is the correct format for a valid key):

	{"my_key":"your key goes here"}


Please refer to app_server/views/design.jade for additional details.

Rev-0: 12/8/15 This code has not yet been developed to a point where it should be utilized.
