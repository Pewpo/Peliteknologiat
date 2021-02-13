extends "res://src/actors/Actor.gd"

var _direction: = 0
func _ready() -> void:
	_direction = -1
	
#Handles enemy movement and collosions.
func _physics_process(delta: float) -> void:
	if is_on_wall():
		_direction = _direction * -1 # When hits wall changes enemy direction
	_velocity.y = _speed.y * _direction * delta
	_velocity.x = move_and_slide(_velocity).x
