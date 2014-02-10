
exports.METERS_PER_LEVEL = 3;

exports.db = {
    host: 'localhost',
    database: 'import'
};

// http://spatialreference.org/
exports.proj = {
    // Chicago IL
    'EPSG:3435': '+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs',
    // San Francisco CA
    'ESRI:102643': '+proj=lcc +lat_1=37.06666666666667 +lat_2=38.43333333333333 +lat_0=36.5 +lon_0=-120.5 +x_0=2000000 +y_0=500000.0000000002 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs'
};
