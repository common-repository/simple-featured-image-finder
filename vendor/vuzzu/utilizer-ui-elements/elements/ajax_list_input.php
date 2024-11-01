<?php

/*************************************************
* Utilizer ui elements: ajax list input
**************************************************/
function uz_ajax_list_input($label,$input_name,$input_value) {

	$options = $input_value;

	?>

		<div class="uz_input">

			<label> <?php echo $label; ?> </label>

			<ul class="ajaxlist">

				<li class="uz_hidden">
					<input type="text" name="<?php echo $input_name; ?>[]" value="" autocomplete="off" class="uz_skip" disabled="disabled" />
					<a href="#" class="delete"> <i class="fa fa-times-circle"></i> </a>
				</li>

				<?php

				if( is_array($options) ) :

					foreach ($options as $option) :

						?>

						<li>
							<input type="text" name="<?php echo $input_name; ?>[]" value="<?php echo $option; ?>" autocomplete="off" />
							<a href="#" class="delete"> <i class="fa fa-times-circle"></i> </a>
						</li>

						<?php

					endforeach;

				endif; ?>

				<li class="controller"> <button type="button" class="add_new"> <i class="fa fa-plus-circle"></i> <?php _e('Add new','uz_terms'); ?> </button> </li>

			</ul>

		</div>

	<?php

}
