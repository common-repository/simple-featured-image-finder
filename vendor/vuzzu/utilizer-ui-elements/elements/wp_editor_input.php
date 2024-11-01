<?php

/*************************************************
* Utilizer ui elements: wp editor input
**************************************************/
function uz_wp_editor_input($label,$input_name,$input_value,$settings=array()) {

	$label_string = "label_{$input_name}";
  $randomId = rand(11111,99999);

	?>

		<div class="uz_input">

			<div class="uz_clear"></div>

			<label for="<?php echo $label_string; ?>"> <?php echo $label; ?> </label>
      <?php wp_editor( $input_value, $label_string . "_" . $randomId, $settings ); ?>

		</div>

	<?php

}
