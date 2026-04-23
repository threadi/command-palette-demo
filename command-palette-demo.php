<?php
/**
 * Plugin Name:       Command Palette Demo
 * Description:       This plugin demonstrate the usage of the command palette.
 * Requires at least: 6.9
 * Requires PHP:      8.1
 * Version:           1.0.0
 * Author:            Thomas Zwirner
 * Author URI:        https://www.thomaszwirner.de
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       command-palette-demo
 *
 * @package command-palette-demo
 */

/**
 * Register our own post type for demo purposes.
 *
 * @return void
 */
function cpd_register_post_type(): void {
    // set arguments for our own cpt.
    $args = array(
        'label'               => __( 'Command Palette Demo', 'command-palette-demo' ),
        'labels'              => array(),
        'supports'            => array( 'title', 'editor' ),
        'public'              => true,
        'show_in_rest'        => true,
    );
    register_post_type( 'cpd_demo', $args );
}
add_action( 'init', 'cpd_register_post_type' );

/**
 * Refresh the permalinks on plugin activation.
 */
register_activation_hook( __FILE__, static function() {
    flush_rewrite_rules();
} );

/**
 * Add scripts to enable the command palette addition to the admin area.
 *
 * @return void
 */
function cpd_enqueue_scripts(): void {
    // get path for the asset script.
    $script_asset_path = trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/index.asset.php';

    // bail if the asset script does not exist.
    if ( ! file_exists( $script_asset_path ) ) {
        return;
    }

    // embed script.
    $script_asset = require $script_asset_path;

    wp_enqueue_script(
        'command-palette-demo',
        trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/index.js',
        $script_asset['dependencies'],
        $script_asset['version'],
        true
    );
}
add_action( 'admin_enqueue_scripts', 'cpd_enqueue_scripts' );
