# frozen_string_literal: true

EMPTY_QUEUE_EXCEPTION = 'Queue is empty'.freeze

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
end
