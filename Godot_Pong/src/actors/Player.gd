extends Actor

# Parent's (Actor.gd) _physics_process will be run first if it exists. 
# After that child's (Player.gd) _physics_process will be run.
func _physics_process(delta: float) -> void:
	var direction: = get_direction()
	_velocity = calculate_move_velocity(_velocity,direction,_speed)
	_velocity = move_and_slide(_velocity)

# Returns direction
func get_direction() -> Vector2:
		var x: = 0.0
		var y: = Input.get_action_strength("move_down") - Input.get_action_strength("move_up")
		return Vector2(x, y)

# Returns new velocity
func calculate_move_velocity(old_velocity: Vector2, direction: Vector2, speed: Vector2) -> Vector2:
		var new_velocity: = old_velocity
		new_velocity.y = speed.y * direction.y * get_physics_process_delta_time()
		return new_velocity
