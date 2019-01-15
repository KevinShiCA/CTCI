# frozen_string_literal: true

EMPTY_STACK_EXCEPTION = 'Stack is empty'

module DataStructures
  class ArrayStack
    def initialize
      @elems = []
    end

    def peek
      return raise EMPTY_STACK_EXCEPTION if @elems.length.zero?

      @elems[@elems.length - 1]
    end

    def push(value)
      @elems.push(value)
    end

    def pop
      return raise EMPTY_STACK_EXCEPTION if @elems.length.zero?

      @elems.pop
    end

    def size
      @elems.length
    end

    def clear
      @elems = []
    end

    def to_array
      @elems.clone
    end

    def empty?
      @elems.length.zero?
    end
  end

  class LinkedStack
    attr_reader :size

    class StackNode
      attr_accessor :value, :next

      def initialize(value, next_node)
        @value = value
        @next = next_node
      end
    end

    def initialize
      @top = nil
      @size = 0
    end

    def peek
      return raise EMPTY_STACK_EXCEPTION if @top.nil?

      @top.value
    end

    def push(value)
      node = StackNode.new(value, @top)
      @top = node
      @size += 1
    end

    def pop
      return raise EMPTY_STACK_EXCEPTION if @top.nil?

      value = @top.value
      @top = @top.next
      @size -= 1

      value
    end

    def clear
      @top = nil
      @size = 0
    end

    def to_array
      current = @top
      result = []
      until current.nil?
        result.push(current.value)
        current = current.next
      end
      result.reverse
    end

    def empty?
      @top.nil?
    end
  end
end
