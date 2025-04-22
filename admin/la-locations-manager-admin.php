<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 */
class LocationsManager_Admin
{

	/**
	 * The ID of this plugin.
	 * 
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 * 
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{

		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Register the stylesheets for the admin area.
	 */
	public function enqueue_styles()
	{
		wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/la-locations-manager-admin.css', array(), $this->version, 'all');
	}

	/**
	 * Register the JavaScript for the admin area.
	 */
	public function enqueue_scripts()
	{
		wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/la-locations-manager-admin.js', array(), $this->version, false);
	}

	function render_plugin()
	{
		if (!current_user_can('manage_options')) {
			wp_die('You do not have sufficient permissions to access this page.');
		}
		require_once("partials/la-locations-manager-admin-display.php");
	}

	function create_admin_menu()
	{
		$page_title = 'Locations Manager';
		$menu_title = 'Locations Manager';
		$capability = 'manage_options';
		$menu_slug = 'la-locations-manager-settings';
		$function = 'render_plugin';
		$icon = 'dashicons-admin-site-alt3';

		add_menu_page(
			$page_title,
			$menu_title,
			$capability,
			$menu_slug,
			array($this, $function),
			$icon
		);
	}
}
