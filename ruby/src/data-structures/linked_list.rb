# frozen-string-literal: true

module DataStructures
  class LinkedListNode
    attr_accessor :value, :prev, :next

    def initialize(value, p, n)
      @value = value
      @prev = p
      @next = n
    end
  end

  class LinkedList
    attr_reader :size

    def initialize
      @head = nil
      @tail = nil
      @size = 0
    end

    # Add a new value at the end of the list.
    def append(value)
      node = LinkedListNode.new(value, @tail, nil)
      if @size.zero?
        @head = node
        @tail = node
        @size += 1
        return
      end

      @tail.next = node
      @tail = node
      @size += 1
    end

    # Appends a list of items sequentially.
    def append_all(items)
      items.each { |item| append(item) }
    end

    # Insert a new value at an index.
    def add(value, index)
      return raise "Index out of bounds: #{index}" if index > @size || index.negative?

      return append(value) if @size.zero?

      node = LinkedListNode.new(value, nil, nil)
      if index.zero?
        node.next = @head
        @head = node
        @size += 1
        return
      end
      if index == @size
        node.prev = @tail
        @tail.next = node
        @tail = node
        @size += 1
        return
      end

      position = 0
      current = @head
      while position < index - 1
        current = current.next
        position += 1
      end
      node.next = current.next
      current.next = node
      node.prev = current
      @size += 1
    end

    # Get the value at an index.
    def get(index)
      return raise "Index out of bounds: #{index}" if index > @size || index.negative?

      position = 0
      current = @head
      while position < index
        current = current.next
        position += 1
      end
      current.value
    end

    # Remove from the list by value (first occurence).
    def remove(value)
      current = @head
      current = current.next while current && current.value != value
      return raise "Value not found: #{value}" if current.nil?

      if current == @head
        @head = @head.next
        @head.prev = nil unless @head.nil?
        @size -= 1
        return
      end
      if current == @tail
        @tail = @tail.prev
        @tail.next = nil unless @tail.nil?
        @size -= 1
        return
      end
      current.prev.next = current.next
      current.next.prev = current.prev
      @size -= 1
    end

    # Remove from the list by index.
    def remove_at(index)
      return raise "Index out of bounds: #{index}" if index > @size || index.negative?

      if @size == 1
        value = @head.value
        clear
        return value
      end
      if index.zero?
        value = @head.value
        @head = @head.next
        @head.prev = nil
        @size -= 1
        return value
      end
      if index == @size - 1
        value = @tail.value
        @tail = @tail.prev
        @tail.next = nil
        @size -= 1
        return value
      end

      current = @head
      position = 0
      while position < index
        current = current.next
        position += 1
      end
      value = current.value
      current.prev.next = current.next
      current.next.prev = current.prev
      @size -= 1
      value
    end

    # Remove and return as a list all nodes that satisfy a predicate.
    # The predicate is passed the value and the index of each node.
    def remove_all(predicate)
      result = []
      each(lambda do |value, index|
        if predicate.call(value, index)
          result.push(value)
          remove(value)
        end
      end)
      result
    end

    # Apply a function to all nodes in the list.
    # The function is passed the value and the index of each node.
    # Can take a lambda or a block.
    def each(*args)
      current = @head
      index = 0
      if args.length.positive?
        until current.nil?
          args[0].call(current.value, index)
          current = current.next
          index += 1
        end
      else
        until current.nil?
          yield(current.value, index)
          current = current.next
          index += 1
        end
      end
    end

    # Apply a function to all nodes in the list.
    # The block is passed the value and the index of each node.
    # def each
    #   current = @head
    #   index = 0
    #   until current.nil?
    #     yield(current.value, index)
    #     current = current.next
    #     index += 1
    #   end
    # end

    # Map the list to an array.
    # The function is passed the value and the index of each node.
    def map_to_array(fn)
      result = []
      current = @head
      index = 0
      until current.nil?
        result.push(fn.call(current.value, index))
        current = current.next
        index += 1
      end
      result
    end

    # Map the list to a linked list.
    # The function is passed the value and the index of each node.
    def map_to_linked_list(fn)
      result = LinkedList.new
      current = @head
      index = 0
      until current.nil?
        result.append(fn.call(current.value, index))
        current = current.next
        index += 1
      end
      result
    end

    # Filter the list by predicate to an array.
    # The predicate is passed the value and the index of each node.
    def filter_to_array(predicate)
      result = []
      each(->(value, index) { result.push(value) if predicate.call(value, index) })
      result
    end

    # Filter the list by predicate to a linked list.
    # The predicate is passed the value and the index of each node.
    def filter_to_linked_list(predicate)
      result = LinkedList.new
      each(->(value, index) { result.append(value) if predicate.call(value, index) })
      result
    end

    # Find the first occurenct of a value that satisfies a predicate.
    # The predicate is passed the value and the index of each node.
    def find(predicate)
      filtered = filter_to_array(predicate)
      return nil if filtered.length.zero?

      filtered[0]
    end

    # Check if the list contains a value.
    def contains(target)
      index_of(target) > -1
    end

    # Returns the index of the first occurence of a value, -1 if the value is not in the list.
    def index_of(target)
      current = @head
      index = 0
      until current.nil?
        return index if current.value == target

        current = current.next
        index += 1
      end
      -1
    end

    # Clear all nodes in the list.
    def clear
      @head = nil
      @tail = nil
      @size = 0
    end

    def empty?
      @size.zero?
    end

    def to_array
      map_to_array(->(value, _) { value })
    end

    def to_s
      return 'EMPTY LIST' if @size.zero?

      return @head.value.to_s if @size == 1

      return "#{@head.value} -> #{@tail.value}" if @size == 2

      str = ''
      current = @head
      until current.next.nil?
        str += "#{current.value} -> "
        current = current.next
      end
      str + current.value.to_s
    end
  end
end
