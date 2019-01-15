# frozen_string_literal: true

EMPTY_PRIORITY_QUEUE_EXCEPTION = 'Priority queue is empty'

module DataStructures
  # Priority goes high to low.
  # The predicate lambda should return 1, 0, or -1.
  # If predicate.call(a, b) = 1, then a has a higher priority than b.

  class ArrayPriorityQueue
    def initialize(predicate)
      @elems = []
      @predicate = predicate
    end

    def peek
      return raise EMPTY_PRIORITY_QUEUE_EXCEPTION if @elems.length.zero?

      @elems[0]
    end

    def enqueue(value)
      @elems.push(value)
      @elems.sort! { |a, b| @predicate.call(a, b) }.reverse!
    end

    def dequeue
      return raise EMPTY_PRIORITY_QUEUE_EXCEPTION if @elems.length.zero?

      @elems.shift
    end

    def size
      @elems.length
    end

    def clear
      @elems = []
    end

    def empty?
      @elems.length.zero?
    end
  end

  class LinkedPriorityQueue
    attr_accessor :size

    class QueueNode
      attr_accessor :value, :next

      def initialize(value, next_node)
        @value = value
        @next = next_node
      end
    end

    def initialize(predicate)
      @predicate = predicate
      @head = nil
      @size = 0
    end

    def peek
      return raise EMPTY_PRIORITY_QUEUE_EXCEPTION if @head.nil?

      @head.value
    end

    def enqueue(value)
      node = QueueNode.new(value, nil)

      if @head.nil?
        @head = node
        @size += 1
        return
      end

      if @size == 1
        if @predicate.call(value, @head.value) >= 0
          node.next = @head
          @head = node
        else
          @head.next = node
        end
        @size += 1
        return
      end

      if @predicate.call(value, @head.value) >= 0
        node.next = @head
        @head = node
        @size += 1
        return
      end

      previous = @head
      current = @head.next
      until current.nil?
        break if @predicate.call(value, current.value) >= 0

        previous = current
        current = current.next
      end
      node.next = current
      previous.next = node
      @size += 1
    end

    def dequeue
      return raise EMPTY_PRIORITY_QUEUE_EXCEPTION if @head.nil?

      value = @head.value
      @head = @head.next
      @size -= 1

      value
    end

    def clear
      @head = nil
      @size = 0
    end

    def empty?
      @head.nil?
    end
  end
end
