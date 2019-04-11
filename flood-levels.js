function floodLayerId(x){
    return "flooding-" + x.feet;
}

function floodLayerLabel(x){
    return x.feet + " ft.";
    // if (Number(x.feet) === 0){ return "0 ft.";}
    // return x.feet;
}

const floodLevels = [
    {
	feet: 6,
	url:'mapbox://borzechowski.5yth1s3m',
	layer:"ct_slr_6ft-cbqhj5",
    },
    {
	feet: 5,
	url:"mapbox://borzechowski.29t008b4",
	layer:"ct_slr_5ft-ddyrve",
    },
    {
	feet: 4,
	url:'mapbox://borzechowski.8rh1nnna',
	layer:"ct_slr_4ft-65vhru",
    },
    {
	feet: 3,
	url:"mapbox://borzechowski.2k5ehn2q",
	layer:"ct_slr_3ft-0r9n0z"
    },
    {
	feet: 2,
	url:"mapbox://borzechowski.1euh68zg",
	layer:"ct_slr_2ft-8315e3",
    },
    {
	feet: 1,
	url:"mapbox://borzechowski.aidm87nz",
	layer:"ct_slr_1ft-8c0g6o"
    },
    {
	feet: 0,
	url:"mapbox://borzechowski.11yryp78",
	layer:"ct_slr_0ft-4oof2c"
    },
    
];

