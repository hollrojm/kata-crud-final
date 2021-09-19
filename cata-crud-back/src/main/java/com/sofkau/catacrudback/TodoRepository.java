package com.sofkau.catacrudback;

import com.sofkau.catacrudback.Todo;
import org.springframework.data.repository.CrudRepository;

public interface TodoRepository extends CrudRepository<Todo, Long> {

}
