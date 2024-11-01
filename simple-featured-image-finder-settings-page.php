<?php

/*--------------------------------------------------*/
/* Simple Background Manager > settings page
/*--------------------------------------------------*/

function mentorgashi_sfif_admin_settings_view() {
  ?>

    <div class="wrap sfif-settings">

      <form method="post" action="options.php">

        <?php settings_fields( 'sfif-settings-group' ); ?>
        <?php do_settings_sections( 'sfif-settings-group' ); ?>

        <h2> <?php _e('Simple Featured Image Finder setup your own Unsplash API credentials','sfif_terms'); ?> </h2>
        <div>
          <?php uz_text_input(__('Enter your Unsplash Application ID','sfif_terms'),'sfif_unsplash_client_id',get_option('sfif_unsplash_client_id')); ?>
        </div>

        <?php submit_button(); ?>

      </form>
    </div>

  <?php

}