<?php

/*************************************************
* Utilizer ui elements: select input
**************************************************/
function uz_select_input($label,$input_name,$input_value,$options,$use_keys=false) {

	$label_string = "label_{$input_name}";

	?>

		<div class="uz_input">

			<label for="<?php echo $label_string; ?>"> <?php echo $label; ?> </label>

			<select id="<?php echo $label_string; ?>" name="<?php echo $input_name; ?>">

				<?php

					if( is_array($options) && count($options) > 0 ) :

						if( $use_keys ) :

							foreach ($options as $value => $option) :

								?>

								<option value="<?php echo $value; ?>" <?php if($input_value==$value) echo 'selected="selected"'; ?> >
									<?php echo $option; ?> </option>

								<?php
							endforeach;

						else :

							foreach ($options as $option) :

								?>

								<option value="<?php echo $option; ?>" <?php if($input_value==$option) echo 'selected="selected"'; ?>>
									<?php echo $option; ?> </option>

								<?php

							endforeach;

						endif;

					endif;

				?>

			</select>

		</div>

	<?php

}
