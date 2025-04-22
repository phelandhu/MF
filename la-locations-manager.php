<?php

/**
 *
 * @package           LA Locations Manager
 * @author 			  Martech Team
 *
 * @wordpress-plugin
 * Plugin Name:       LaserAway Locations Manager
 * Description:       This plugin allows for managing our locations table, it allows for CRUD, Sync from Locations App, and sending the dropdown info to the GCP Secrets
 * Version:           1.0.0
 * Author:            Laseraway
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Update it as you release new versions.
 */
define( 'LA_LOCATIONS_MANAGER_VERSION', '1.0.1' );


/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/la-locations-manager-core.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 */
function run_plugin_name() {
	$plugin = new LocationsManager();
	$plugin->run();

}
run_plugin_name();
