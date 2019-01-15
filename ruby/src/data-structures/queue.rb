# frozen_string_literal: true

EMPTY_QUEUE_EXCEPTION = 'Queue is empty'

module DataStructures
  class ArrayQueue
    def initialize
      @elems = []
    end

    def peek
      return raise EMPTY_QUEUE_EXCEPTION if @elems.length.zero?

      @elems[0]
    end

    def enqueue(value)
      @elems.push(value)
    end

    def dequeue
      return raise EMPTY_QUEUE_EXCEPTION if @elems.length.zero?

      @elems.shift
    end

    def size
      @elems.length
    end

    def clear
      @elems = []
    end

    def to_array
      @elems
    end

    def empty?
      @elems.length.zero?
    end
  end

  class LinkedQueue
    attr_reader :size

    class QueueNode
      attr_accessor :value, :next

      def initialize(value, next_node)
        @value = value
        @next = next_node
      end
    end

    def initialize
      @head = nil
      @size = 0
    end

    def peek
      return raise EMPTY_QUEUE_EXCEPTION if @head.nil?

      @head.value
    end

    def enqueue(value)
      node = QueueNode.new(value, nil)
      if @head.nil?
        @head = node
        @size += 1
        return
      end

      current = @head
      current = current.next until current.next.nil?
      current.next = node
      @size += 1
    end

    def dequeue
      return raise EMPTY_QUEUE_EXCEPTION if @head.nil?

      value = @head.value
      @head = @head.next
      @size -= 1

      value
    end

    def clear
      @head = nil
      @size = 0
    end

    def to_array
      result = []
      current = @head
      until current.nil?
        result.push(current.value)
        current = current.next
      end
      result
    end

    def empty?
      @head.nil?
    end
  end
end
