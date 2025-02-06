let CPM = require("../../build/artistoo-cjs.js")


/*	----------------------------------
	CONFIGURATION SETTINGS
	----------------------------------
*/
let config = {

	// Grid settings
	ndim: 2,
	field_size: [250,250],
  
	// CPM parameters and configuration
	conf: {
	  // Basic CPM parameters
	  torus: [true, true],
	  seed: 1,
	  T: 20,
  
	  // Constraint parameters
	  // Adhesion: now a 3x3 array (background, normal cell, obstacle)
	  J: [
		[0,   20,  100],
		[20,   0,  100],
		[100, 100,   0]
	  ],
  
	  // VolumeConstraint parameters (0 for background, 500 for normal cell, 250 for obstacle)
	  LAMBDA_V: [0, 50, 50],
	  V: [0, 200, 100],
  
	  // PerimeterConstraint parameters
	  LAMBDA_P: [0, 2, 10],
	  P: [0, 180, 40],
  
	  // ActivityConstraint parameters (obstacles are immobile)
	  LAMBDA_ACT: [0, 140, 0],
	  MAX_ACT: [0, 20, 0],
	  ACT_MEAN: "geometric"
	},
  
	// Simulation setup and configuration
	simsettings: {
	  // Define number of cells: [normal cells, …, obstacles]
	  // In our case, index 0 = background, index 1 = normal cells, index 2 = obstacles.
	  NRCELLS: [20, 0, 5],
	  
	  // Other simulation parameters as before...
	  BURNIN: 50,
	  RUNTIME: 1000,
	  RUNTIME_BROWSER: "Inf",
	  
	  // Visualization: add a third color (for obstacles, e.g., "blue")
	  CANVASCOLOR: "eaecef",
	  CELLCOLOR: ["000000", "ff0000", "0000ff"],
	  
	  ACTCOLOR: [true, true, false],
	  
	  SHOWBORDERS: [false, false, false],
	  zoom: 2,
	  
	  // Output image settings
	  SAVEIMG: true,
	  IMGFRAMERATE: 1,
	  SAVEPATH: "output/img/CollectiveMigration",
	  EXPNAME: "CollectiveMigration",
	  
	  // Output stats settings
	  STATSOUT: { browser: false, node: true },
	  LOGRATE: 10
	}
  }

	let sim = new CPM.Simulation( config, {} )

/* The following custom methods are used for control buttons on the html page.*/


function startsim(){
	if( !sim.running ){
		sim.running = true
	}
}
function stopsim(){
	sim.running = false
}

function seedCell( k ){
	sim.gm.seedCell(k)
}
  
function seedCells( ncells ){
	for( let i = 0; i < ncells; i++ ){
		seedCell( 1 )
	}
}
function killCell(){
	let t
	let cells = Object.keys( sim.C.getStat( CPM.PixelsByCell ) )
	if( cells.length > 0 ){
		t = cells.pop()
		for( let cp of sim.C.cellPixels() ){
			if( cp[1] == t ){
				sim.C.setpix( cp[0], 0 )
			}
		}
	}
	sim.C.stat_values = {}

}
function killAllCells(){
	let cells = Object.keys( sim.C.getStat( CPM.PixelsByCell ) )
	if( cells.length == 0 ) return
	for( let cp of sim.C.cellPixels() ){
		sim.C.setpix( cp[0], 0 )
	}
}



sim.run()