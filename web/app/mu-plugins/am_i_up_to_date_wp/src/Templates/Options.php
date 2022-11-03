<div class="wrap">
  <h1>Acti - Am I Up To Date</h1>

  <form method="post" action="options.php">
    <?php settings_fields('acti-amiuptodate'); ?>
    <?php do_settings_sections('acti-amiuptodate'); ?>
    <table class="form-table">
      <tr valign="top">
        <th scope="row">Route url</th>
        <td><input type="text" name="aiutd_route_url" value="<?php echo esc_attr(get_option('aiutd_route_url')); ?>" /></td>
      </tr>

      <tr valign="top">
        <th scope="row">API key</th>
        <td><input type="text" name="aiutd_api_key" value="<?php echo esc_attr(get_option('aiutd_api_key')); ?>" /></td>
      </tr>
    </table>

    <?php submit_button(); ?>

  </form>
</div>
